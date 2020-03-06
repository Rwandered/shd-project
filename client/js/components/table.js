import Settings from '../requests/settings.js';
import Toasts from './toasts.js'
import Tasks from '../requests/tasks.js';
import { setColorTask, updateColorTask } from '../actions/markTask.js';
import { createChatWindow, startChat } from './chat.js';


const settings = new Settings();
const task = new Tasks();
const toast = new Toasts();

export default class Table {

    async renderTable(tasks) {
        //tasks - массив задач
        // console.log(tasks)
        try {
            //1) создаем таблицу
            const table = createTable();
            //2) создаем заголовок таблицы
            const tableHeader = getHeader();
            //3) добавляем заголовок в таблицу
            table.insertAdjacentHTML('beforeend', tableHeader);

            //4) корректируем данные 

            //ТУТ НАДО ИЗБАВИТЬСЯ ОТ FOREACH так как это метод синхронный и не работает с промисами надо использовать for of
            // tasks.forEach(async task => {
            //     const taskData = await this.getTaskData(task);
            //     //5) формируем  содержимое таблицы
            //     const tableBody = this.getBody(taskData);


            //     //7) добавим обработчики события для таблицы
            //     createEvents(tableBody);

            //     //8) добавлем содержимое  в таблицу
            //     table.insertAdjacentElement('beforeend', tableBody);
            // });

            for (let task of tasks) {
                console.log(task)
                const taskData = await this.getTaskData(task);
                //5) формируем  содержимое таблицы
                const tableBody = this.getBody(taskData);

                //7) добавим обработчики события для таблицы
                createEvents(tableBody);
                //8) добавлем содержимое  в таблицу
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
                <td class="id er">${data.id}</td>
                <td class="theme">${data.theme}</td>
                <td class="from">${data.from}</td>
                <td class="to">${data.to}</td>
                <td class="creationDate">${data.creationDate}</td>
                <td class="status">${data.status}</td>
                <td class="select"><span>▼</span></td>                        
            </tr>
            <tr class="taskDescription-display taskDescription">
                <td colspan="8">${data.description}</td>                        
            </tr>`

        tableBody.insertAdjacentHTML('beforeend', tableStr)
        return tableBody;
    }

    async getTaskData(task) {
        const userTo = await settings.getUserById(task.to) // на кого задача
        const userFrom = await settings.getUserById(task.from) // на кого задача
        const themeName = await settings.getThemeById(task.theme) // тема задачи
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
        };
        return taskData;
    }
}


const getHeader = () => {
    const header = `
    <thead>
        <tr>
            <th>Id</th>
            <th>Тема задачи</th>
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
    return table;
}


export const createEvents = tableBody => {
    tableBody.addEventListener('click', () => {

        const taskDescription = tableBody.querySelector('.taskDescription');
        if (event.target.classList.contains('theme')) {
            taskDescription.classList.toggle('taskDescription-display');
        }

        if (event.target.classList.contains('from')) {
            console.log('Start chat');
        }

        if (event.target.classList.contains('to')) {
            console.log('Start chat-1');
            startChat(tableBody);
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
        top: ${sizeSelect.status.clientTop + sizeSelect.status.offsetTop}px;
    `;
    return selectWrapper;
}

// ================================================>
const repositionSelect = (selectWrapper, sizeSelect) => {
    selectWrapper.style.left = sizeSelect.status.clientLeft + sizeSelect.status.offsetLeft + sizeSelect.width - selectWrapper.offsetWidth + 'px';
    selectWrapper.style.top = sizeSelect.status.clientTop + sizeSelect.status.offsetTop + 'px';
}