import Settings from '../requests/settings.js';
import Loader from '../components/loader.js';
import Toasts from '../components/toasts.js';
import Task from '../requests/tasks.js';
import Table, { createEvents } from '../components/table.js';
import { startValidation } from '../checking/validation.js';
import { elementAppearance, elementDisappearing } from '../actions/visibility.js';
import { createSelectField, createList, setSelectFieldStyle } from '../components/selectElement.js';
import {
    createModalContainer,
    createModalLayer,
    createModalHeader,
    createModalBtn,
    setCommonEvents,
    setCommonPosition,
    closeWindow
} from './modalComm.js';


const setting = new Settings();
const loader = new Loader();
const toasts = new Toasts();
const task = new Task();
const table = new Table()

export const renderTaskModalWindow = (itemid, headerName) => {
    // 1) создаем контейнер
    const modalContainer = createModalContainer();
    //2) создаем layer
    const modalLayer = createModalLayer();
    //3) созадем заголовок для модального окна
    const modalHeader = createModalHeader(headerName);
    // 4) создаем модальное окно для создания задачи
    const taskModal = createTaskModal();
    //5) создаем элементы управления в модальном окне кнопки
    const modalBtn = createModalBtn(headerName);

    //6) собираем все в контейнер 
    modalContainer.insertAdjacentHTML('beforeend', modalHeader);
    modalContainer.insertAdjacentHTML('beforeend', taskModal);
    modalContainer.insertAdjacentElement('beforeend', modalBtn);

    //7) задаем стилизацию
    setStyleContainer(modalContainer);
    //8) Заполняем поля по умолчанию
    defaultFill(itemid, modalContainer);
    //9) выводим все на экран
    document.body.insertAdjacentElement('beforeend', modalContainer);

    //10) задаем позиционирование контейнера общее
    setCommonPosition();
    //11) вешаем общие события
    setCommonEvents(modalContainer, modalLayer);
    //12) задаем кастомное позиционирование контейнера
    setTaskModalPosition();
    //13) вешаем кастомные события
    setTaskModalEvents(modalContainer);
};



const createTaskModal = () => {
    const taskModal = `
    <form class="methods">
        <div class="left-side">
            <label for="">Тема:</label>
            <div class="select-theme">
                <p>Выберите тему</p>
                <span>▼</spans>
            </div>
            <input type="text" name="themeId" id="themeId" class="valid-item hide">
            <label for="description">Описание</label>
            <textarea name="description" id="description" class="description valid-item" ></textarea>
        </div>    
        <div class="right-side">
            <label for="from">От кого</label>
            <input type="text" name="from" id="from" readonly class="fill-default">
            <input type="text" name="fromId" id="fromId" class="hide fill-default">
            <label for="to">Кому</label>
            <input type="text" name="to" id="to" class="valid-item" readonly>
            <div class="select-users toggleToHide">
                <p>Выберите исполнителя</p>
                <span>▼</spans>
            </div>
            <input type="text" name="toId" id="toId" class="hide valid-item">
            <label for="">Дата создания</label>
            <input type="text" id="dateNow" class="fill-default" readonly>
            <label for="">Данные для связи</label>
            <input type="text" name="communication" id="communication" class="valid-item">
        </div>
    </form>      
    `;
    return taskModal;
};


const setStyleContainer = container => {
    if (document.documentElement.clientWidth <= 600) {
        container.style.width = '288px';
        container.style.height = '580px';
    } else {
        container.style.width = '570px';
        container.style.height = '350px';
    }
};

const setTaskModalPosition = () => {
    document.body.style.overflowY = 'visible';
    const formWrapper = document.querySelector('.modalWindow-wrapper');
    const mainPart = document.getElementById('main-part');
    console.log(mainPart)
    if (formWrapper) {
        if (document.documentElement.clientWidth <= 600) {
            document.body.style.overflowY = 'visible';
            setStyleContainer(formWrapper);
        } else {
            setStyleContainer(formWrapper);
        }
        //1) получить текущию ширину окна когда она становиться меньше 600рх включаем overflow на вертикаль и меняем у модалки размеры на 
        // такие высота 580 ширина 288 и позиционирую его по центру
        formWrapper.style.left = Math.round(document.documentElement.clientWidth / 2 - formWrapper.offsetWidth / 2) + 'px';
        formWrapper.style.top = Math.round(mainPart.offsetTop) + 'px';
    }
};


const setTaskModalEvents = element => {
    element.addEventListener('click', () => {
        if (event.target.tagName == 'BUTTON') {
            createNewTask(element);
        } else if (event.target.closest('.select-theme')) {
            createSelectThemeField(element, event.target.closest('.select-theme'));
        } else if (event.target.closest('.select-users')) {
            createSelectUsersField(event.target.closest('.select-users'));
        }
    });
    window.addEventListener('resize', setTaskModalPosition);
};



//===========================================МЕТОДЫ ДЛЯ СОЗДАНИЕ ИНДИВИДУАЛЬНЫХ ЭЛЕМЕНТОВ ВЫПАДАЮЩЕГО СПИСКА ДЛЯ ТЕМ
const createSelectThemeField = (rootElement, parentElement) => {
    // parentElement - относительно чего создавать элемент списка
    // rootElement - основной контейнер модального окна
    //1) создаем оболочку для выпадающего списка
    const selectThemeWrapper = createSelectField();
    //2) создаем элементы списка - сюда придет ul + li (заголовок)
    const listWrapper = createList();
    //3) Создаем индивидуальный контент в элемент списка 
    addListContentForTheme(listWrapper, parentElement, selectThemeWrapper)
        .then(result => selectThemeWrapper.insertAdjacentElement('beforeend', result))
        .catch(e => {});
    //4) задаем стили контейнеру
    setSelectFieldStyle(selectThemeWrapper, parentElement);
    //5) Показываем элемент
    elementAppearance(rootElement, selectThemeWrapper, 2 / 100);
    //6) Фокусируемся на элементе
    selectThemeWrapper.focus();
    //7) Устанавливаем событие потери фокуса - элемент исчезает
    selectThemeWrapper.addEventListener('focusout', () => { elementDisappearing(event.target, 2 / 100); });
};


const addListContentForTheme = async(listWrapper, parentElement, selectWrapper) => {
    // parentElement - кнопка для выпадающего меню
    // selectWrapper - обертка выпадающего меню
    // listWrapper - элемент ul выпадающего меню 
    try {
        const themes = await setting.getAllTheme();
        themes.forEach(theme => {
            //тут мы добавили элементы выпадающего списка
            const listElement = document.createElement('li');
            listElement.classList.add('lContent');
            const listContent = `<span>${theme.theme}</span>`;
            listElement.insertAdjacentHTML('beforeend', listContent);

            listWrapper.insertAdjacentElement('beforeend', listElement);

            // теперь надо навесить события клика на эти элементы
            // метод который навесит событие клика на лишки с последующим заполнением нужных полей
            addEventToSelectTheme(listElement, parentElement, selectWrapper, theme);
        });
        return listWrapper;
    } catch (e) {}
};


const addEventToSelectTheme = (listElement, selectElement, selectWrapper, item) => {
    // selectElement - кнопка показа выпадающего меню
    // listElement - элемент li выпадающего списка
    // selectWrapper - обертка выпадающего списка
    //item - значение из базы 
    // ячейка с themeId
    const themeId = document.getElementById('themeId');
    //  ячейка с toId
    const toId = document.getElementById('toId');
    // ячейка с именем to пользователя
    const to = document.getElementById('to');
    //ячейка с select-users
    const selectUsers = document.querySelector('.select-users');

    listElement.addEventListener('click', async() => {
        //1) текстовое значение записсать в select-theme
        [...selectElement.children][0].textContent = event.target.textContent;
        //2) скрыть весь контейнер с выпадающим списком
        elementDisappearing(selectWrapper, 2 / 100);
        //3) заполнить поле с id темой
        themeId.value = item._id;
        //4) заполнить поле с id для to - пользователя,но у одной темы может быть несколько исполнителей
        //поэтому сначала проверяем его количество
        // console.log(item.executor);
        //5.1) если исполнитель 1
        if (item.executor.length == 1) {
            //5.1.1) записываем значение id в ячейку toId
            toId.value = item.executor;
            if (to.classList.contains('valid-item')) {

            } else {
                to.classList.add('valid-item')
            }
            //5.1.2) получаем данные для id пользователя для заполнения ячейки to
            try {
                const user = await setting.getUserById(item.executor);

                to.value = user.name;
                if (to.classList.contains('toggleToHide')) {
                    to.classList.toggle('toggleToHide');
                    selectUsers.classList.toggle('toggleToHide');
                }
                return user;
            } catch (error) {
                return console.error(error);
            }
        }
        //5.2) сюда придет если больше 1 исполнителя
        if (selectUsers.classList.contains('toggleToHide')) {
            if (to.classList.contains('valid-item')) {
                to.classList.remove('valid-item')
            }
            //5.2.1) спрятать ячейку to
            to.classList.toggle('toggleToHide');
            //5.2.2) очистить ячейку с toId и привести к default  selectUsers
            toId.value = '';
            [...selectUsers.children][0].textContent = 'Выберите исполнителя';
            //5.2.3) показать элемент для выбора пользователей добавить на него событие клика
            selectUsers.classList.toggle('toggleToHide');
        }
        //5.2.4) запишем в localStorage данные об id если их несколько
        localStorage.setItem('toUser', item.executor);
    });
};


const createSelectUsersField = parentElement => {
    // parentElement - относительно чего создавать элемент списка
    // rootElement - основной контейнер модального окна
    // основной контейнер модального окна
    const rootElement = document.querySelector('.modalWindow-wrapper');
    //1) создаем оболочку выпадающего списка
    const selectUsersWrapper = createSelectField();
    //2) создаем элементы списка - сюда придет ul + li (заголовок)
    const listWrapper = createList();
    //3) Создаем индивидуальный контент в элемент списка
    addListContentForExecutors(listWrapper);

    selectUsersWrapper.insertAdjacentElement('beforeend', listWrapper);
    //4) задаем стили контейнеру
    setSelectFieldStyle(selectUsersWrapper, parentElement);
    //5) Показываем элемент
    elementAppearance(rootElement, selectUsersWrapper, 2 / 100);
    //6) Фокусируемся на элементе
    selectUsersWrapper.focus();
    //7) Устанавливаем событие потери фокуса - элемент исчезает
    selectUsersWrapper.addEventListener('focusout', () => { elementDisappearing(event.target, 2 / 100); });
};


// прочитать map работат ли с async
const addListContentForExecutors = async listWrapper => {
    // listWrapper - ul -  то куда будем добавлять li
    const executors = localStorage.getItem('toUser').split(',');
    const userNames = executors.map(async elem => {
        try {
            return await setting.getUserById(elem);
        } catch (e) {}
    });

    //ТУТ НАДО ИЗБАВИТЬСЯ ОТ FOREACH так как это метод синхронный и не работает с промисами надо использовать for of

    // userNames.forEach(async userName => {
    //     try {
    //         const user = await userName;

    //         const listElement = document.createElement('li');
    //         listElement.classList.add('lContent');
    //         const listContent = `<span>${user.name}</span>`;
    //         listElement.insertAdjacentHTML('beforeend', listContent);

    //         listWrapper.insertAdjacentElement('beforeend', listElement);

    //         listElement.addEventListener('click', () => { addEventToSelectUser(event.target, user); });

    //     } catch (e) {}
    // });

    for (let userName of userNames) {
        try {
            const user = await userName;

            const listElement = document.createElement('li');
            listElement.classList.add('lContent');
            const listContent = `<span>${user.name}</span>`;
            listElement.insertAdjacentHTML('beforeend', listContent);

            listWrapper.insertAdjacentElement('beforeend', listElement);

            listElement.addEventListener('click', () => { addEventToSelectUser(event.target, user); });

        } catch (e) {}
    }

};

const addEventToSelectUser = (target, user) => {
    // //  ячейка с toId
    const toId = document.getElementById('toId');
    // //ячейка с select-users
    const toBtn = document.querySelector('.select-users');
    const selectUserWrapper = target.closest('.select-wrapper');
    //1) текстовое значение записсать в select-theme
    [...toBtn.children][0].textContent = target.textContent;
    //2) скрыть весь контейнер с выпадающим списком
    elementDisappearing(selectUserWrapper, 2 / 100);
    //3) заполнить поле с id user
    toId.value = user._id;
};
//===============================================================
const defaultFill = async(id, container) => {
    // fill-default
    //1) получаем поля для заполнения по умолчанию
    const defaultFields = container.querySelectorAll('.fill-default');
    //2) делаем запрос к базе для получения данных о пользователе
    const user = await setting.getUserById(id);
    [...defaultFields][0].value = user.name;
    [...defaultFields][1].value = user._id;
    [...defaultFields][2].value = new Date().toLocaleDateString();
}

// ===========================CREATE NEW TASK
const createNewTask = modalContainer => {
    //1) проверка на заполненность полей
    startValidation(modalContainer) ?
        addTaskToWindow(modalContainer) :
        toasts.createToastContainer('Ошибки при создании задачи...');
}

const addTaskToWindow = container => {

    loader.startLoader(container);

    const oops = document.querySelector('.oops');
    const layer = document.querySelector('.bg-layer')

    elementDisappearing(oops, 1 / 4);

    const tableField = document.getElementById('main-part');
    const tableContainer = tableField.querySelector('.table');
    //1) получаем форму
    const forma = container.querySelector('form');
    //2 формируем данные
    const newTask = {
            theme: forma.elements.themeId.value,
            from: forma.elements.fromId.value,
            to: forma.elements.toId.value,
            description: `${description.value}.
         Связаться со мной: ${communication.value}`,
        }
        //3) запишем данные в базу
    const userTask = task.createTask(newTask)
        //4) если есть таблица то вызываем метод формирование строки в таблице
        // если же нет то вызываем метод формирование таблицы + задача
    if (tableContainer) {
        const tableContainerHeader = tableContainer.querySelector('thead')
        userTask
            .then(result => table.getTaskData(result.task))
            .then(result => table.getBody(result))
            .then(result => {
                createEvents(result);
                tableContainerHeader.insertAdjacentElement('afterend', result);
            })
            .catch(e => console.error(e))
    } else {
        userTask
            .then(result => table.renderTable([result.task]))
            .then(result => elementAppearance(tableField, result, 1 / 300))
            .catch(e => console.error(e));
    }

    loader.stopLoader();
    toasts.createToastContainer('Task has been created...');
    closeWindow(container, layer);
}

// решение верхей функции через промисы без async await

// if (item.executor.length == 1) {
//     toId.value = item.executor;
//     return setting.getUserById(item.executor)
//         .then(user => to.value = user.email)
//         .catch(error => console.error(error))
// }


//  // userNames - массив промисов
//  const userNames = item.executor.map(elem => setting.getUserById(elem));
//  //используем EcmaScript 2020 Promise.allSettled
//  Promise.allSettled(userNames)
//      .then(result => {
//          // result - массив ресультатов промисов содержит 2 объекта - 1- статус промиса -2 его значение
//          result.forEach(r => {

//              //тут надо создать выпадающее меню заменим елемент с id to на div выпадающего меню
//              // элементами выпадающего меню должны стать наименования пользователей, полученных в promis ах
//              // на каждом элементе списка должно быть событие клика при котором
//              // с скрытое поле toId добавляется id пользователя
//              // изначально text content на div выпадающего меню должен быть "Выберите исполнителя:"
//          });
//      })