import Toasts from '../toasts/toasts.js';
import Task from '../../requests/tasks.js';
import { startChat } from '../chat/chat.js';
import { setColorTask, updateColorTask } from '../tasks/actionsWithTasks/markTask.js';
import { getUserName, getThemeName } from '../../actions/caching.js';
import { showChat } from '../chat/actionsWithChat/displayChat.js';
import { getCurrentUser } from '../../checking/checkAuth.js';
import { newTaskStatusToWs } from '../../webSockets/wsInteraction.js';

const task = new Task();
const toast = new Toasts();

export default class Table {
  async renderTable(tasks) {
    try {
      //1) создаем таблицу
      const table = createTable();
      //2) создаем заголовок таблицы
      const tableHeader = getHeader();
      //3) добавляем заголовок в таблицу
      table.insertAdjacentHTML('beforeend', tableHeader);
      //4) корректируем данные 
      for (let task of tasks) {
        const taskData = await this.getTaskData(task);
        //5) формируем  содержимое таблицы
        const tableBody = this.getBody(taskData);
        startChat(tableBody)
          //6) добавим обработчики события для таблицы
        createEvents(tableBody);
        //7) добавлем содержимое  в таблицу
        table.insertAdjacentElement('beforeend', tableBody);
      }
      return table;
    } catch (e) {}
  }

  getBody(data) {
    const tableBody = document.createElement('tbody');
    tableBody.classList.add('tableBody', `${setColorTask(data.status)}`);
    const tableStr = `
            <tr class="task">
                <td class="id">${data.id}</td>
                <td class="theme">${data.theme}</td>
                <td class="chatting"><img class="chat-logo" src="chatting.png"/><span class="mess-counter"></span></td>
                <td class="from">${data.from}</td>
                <td class="to">${data.to}</td>
                <td class="creationDate">${data.creationDate}</td>
                <td class="status">${data.status}</td>
                <td class="select"><span>▼</span></td>                        
            </tr>
            <tr class="taskDescription-display taskDescription">
                <td colspan="8">${data.description}</td>                        
            </tr>`
    tableBody.dataset.taskContent = JSON.stringify(data.chatting);
    tableBody.insertAdjacentHTML('beforeend', tableStr)
    return tableBody;
  }

  async getTaskData(task) {
    try {
      const currentUser = await getUserName(getCurrentUser().userId) //текущий пользователь
      const userFrom = await getUserName(task.from) // на кого задача
      const userTo = await getUserName(task.to)
      const themeName = await getThemeName(task.theme) // тема задачи
      const date = new Date(task.creationDate); //дата 
      const customDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      const taskData = {
        id: task._id,
        theme: themeName.theme,
        to: userTo.name,
        from: userFrom.name,
        creationDate: customDate,
        status: task.status,
        description: task.description,
        chatting: {
          taskId: task._id,
          fromUserId: task.from,
          toUserId: task.to,
          taskTheme: themeName.theme,
          userRole: currentUser.role,
        }
      };
      return taskData;
    } catch {}
  }
}

const getHeader = () => {
  const header = `
    <thead>
        <tr>
            <th>Id</th>
            <th colspan="2">Тема задачи</th>
            <th>Инициатор задачи</th>
            <th>Исполнитель</th>
            <th>Дата создания задачи</th>
            <th colspan="2">Статус исполнения</th>
        </tr>
    </thead>`;
  return header;
}

const createTable = () => {
  const table = document.createElement('table');
  table.classList.add('table');
  table.style.margin = '5px';
  table.dataset.elementId = 'table';
  return table;
}


export const createEvents = tableBody => {
  tableBody.addEventListener('click', () => {
    const taskDescription = tableBody.querySelector('.taskDescription');
    if (event.target.classList.contains('theme')) {
      taskDescription.classList.toggle('taskDescription-display');
    }
    if (event.target.closest('.chatting')) {
      showChat(tableBody, event.target.closest('.chatting'));
    }
    if (event.target.closest('.select')) {
      //1) получаем размеры для контейнера
      const sizeSelect = getSelectSize(tableBody, event.target)
        //2) создаем контейнер
      const selectWrapper = createSelect(sizeSelect);
      //5) добавляем обертку на страницу
      addSelectWrapper(selectWrapper);
      //6) добавляем событие для ре позишен селекта
      window.addEventListener('resize', () => { repositionSelect(selectWrapper, sizeSelect) });
      //7) вещаем обработчик на лишки
      const statusList = selectWrapper.querySelector('ul')
      statusList.addEventListener('click', () => { changeTaskStatus(event.target, sizeSelect.status) });
      //8) при потере фокуса закрываем список
      selectWrapper.addEventListener('focusout', () => { fadeOutList(event.target) })
    }
  });
}

// ========================================>
//Эта функция меняет статус в выведенной таблице и обновляет данные в базе
const changeTaskStatus = (element, statusField) => {
  if (element.closest('.lStatus')) { //заголовок списка
    fadeOutList(element);
  }
  if (element.closest('.lSelect')) { //'элементы' списка
    statusField.textContent = element.textContent;
    updateColorTask(statusField);
    //далее тут вызываем async функцию для update table into mongo
    const tableBody = statusField.closest('.tableBody')
    const taskId = tableBody.querySelector('.id').textContent;
    const result = task.updateTaskStatus(taskId, statusField.textContent);
    const taskContent = JSON.parse(tableBody.dataset.taskContent);
    // console.log(taskContent)
    const newDataToWs = {
      taskId: taskContent.taskId,
      howRecipient: taskContent.toUserId,
      taskStatus: statusField.textContent
    }
    if (taskContent.userRole != 'user') {
      newDataToWs.howRecipient = taskContent.fromUserId
    }
    newTaskStatusToWs(newDataToWs)
    result.then(result => toast.createToastContainer(result.message))
      // и закрываем список
    fadeOutList(element);
  }
}

// =========================================>
//fadeOutList - при потере фокуса
const fadeOutList = element => {
  const target = element.closest('.select-wrapper');
  const step = 1 / 50;
  const intr = setInterval(() => {
    if (+target.style.opacity <= 0) {
      clearInterval(intr);
      target.remove();
    }
    target.style.opacity = +target.style.opacity - step;
  }, 0.01)
}

// ========================================>
const addSelectWrapper = element => {
  const mainPart = document.getElementById('main-part');
  mainPart.insertAdjacentElement('beforeend', element);
  const stp = 1 / 50;
  const interval = setInterval(() => {
    if (+element.style.opacity >= 1) {
      clearInterval(interval);
      element.focus();
    }
    element.style.opacity = +element.style.opacity + stp;
  }, 0.01)
}

//================================================>
// Формируем размеры для страницы для хранения их в объекте
const getSelectSize = (targetParent, target) => {
  const select = target.closest('.select')
  const status = targetParent.querySelector('.status')
  const width = select.offsetWidth + status.offsetWidth;
  return { select, status, width }
}

// ================================================>
const createSelect = sizeSelect => {
  const selectWrapper = document.createElement('div')
  selectWrapper.classList.add('select-wrapper');
  const selectList = `
        <ul>
            <li class="lStatus"><span>Статус задачи:</span></li>
            <li class="lSelect"><span>Активная</span></li>
            <li class="lSelect"><span>Приостановлена</span></li>
            <li class="lSelect"><span>Закрыта</span></li>
        </ul>`
    //3) дабавляем список контейнер
  selectWrapper.insertAdjacentHTML('beforeend', selectList);
  selectWrapper.tabIndex = '0';
  //4) задаем стили контейнеру
  selectWrapper.style.cssText = `
        box-sizing: border-box;
        width: ${2*sizeSelect.width}px;
        position: absolute;
        margin: 5px;
        left: ${sizeSelect.status.clientLeft + sizeSelect.status.offsetLeft + sizeSelect.width - 2*sizeSelect.width}px;
        top: ${sizeSelect.status.clientTop + sizeSelect.status.offsetTop}px;`
  return selectWrapper;
}

// ================================================>
const repositionSelect = (selectWrapper, sizeSelect) => {
  selectWrapper.style.left = sizeSelect.status.clientLeft + sizeSelect.status.offsetLeft + sizeSelect.width - selectWrapper.offsetWidth + 'px';
  selectWrapper.style.top = sizeSelect.status.clientTop + sizeSelect.status.offsetTop + 'px';
}