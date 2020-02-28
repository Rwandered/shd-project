import Toasts from '../components/toasts.js';
import Settings from '../requests/settings.js';
import { elementAppearance, elementDisappearing } from '../actions/visibility.js';
import { createSelectField, createList, setSelectFieldStyle } from '../components/selectElement.js';
import { createModalContainer, createModalLayer, createModalHeader, createModalBtn, setCommonEvents, setCommonPosition } from './modalComm.js';


const toasts = new Toasts();
const settings = new Settings();

export const createThemeModalWindow = modalContent => {
    // 1) создаем контейнер
    const modalContainer = createModalContainer();
    //2) создаем layer
    const modalLayer = createModalLayer();
    //3) созадем заголовок для модального окна
    const modalHeader = createModalHeader(modalContent.header);
    // 4) создаем модальное окно для задания роли
    const themeModal = createRoleModal(modalContent);
    //5) создаем элементы управления в модальном окне кнопки
    const modalBtn = createModalBtn(modalContent.header);

    //6) собираем все в контейнер 
    modalContainer.insertAdjacentHTML('beforeend', modalHeader);
    modalContainer.insertAdjacentHTML('beforeend', themeModal);
    modalContainer.insertAdjacentElement('beforeend', modalBtn);

    //7) выводим все на экран
    document.body.insertAdjacentElement('beforeend', modalContainer);
    //8) задаем позиционирование контейнера общее
    setCommonPosition();
    //9) вешаем общие события
    setCommonEvents(modalContainer, modalLayer);
    //10) вешаем кастомные события
    setThemeModalEvents(modalContainer);

    console.log(modalContainer)
}


const createRoleModal = modalContent => {
    console.log(modalContent)
    const themeModalContent = `
    <form action="" class="methods">
        <label for="${modalContent.contentName[0]}">${modalContent.labelName[0]}</label>
        <div class="select-themes select-item">
            <p>Выберите ${modalContent.contentName[0]}</p>
            <span>▼</spans>                
        </div>
        <input class="toggleToHide" type="${modalContent.type[0]}" name="${modalContent.contentName[0]}" id="${modalContent.contentName[0]}" placeholder="${modalContent.labelName[0]}">
        <input type="${modalContent.type[0]}" name="themeId" id="themeId" hidden>
        <label for="${modalContent.contentName[1]}">${modalContent.labelName[1]}</label>           
        <div class="select-users select-item">
            <p>Выберите администратора</p>
            <span>▼</spans>                
        </div>
        <input type="${modalContent.type[1]}" name="${modalContent.contentName[1]}" id="${modalContent.contentName[1]}" hidden>
    </form>`;
    return themeModalContent;
}


const setThemeModalEvents = element => {
    element.addEventListener('click', () => {
        if (event.target.tagName == 'BUTTON') {
            createNewTheme(element);
        }
        if (event.target.closest('.select-item')) {
            const selectItem = event.target.closest('.select-item');
            createSelectThemeField(selectItem);
        }
    });
};


const createSelectThemeField = parentElement => {
    // console.log(parentElement)
    // parentElement - относительно чего создавать элемент списка - по чему произошел клик
    // rootElement - основной контейнер модального окна
    // основной контейнер модального окна
    const rootElement = document.querySelector('.modalWindow-wrapper');
    //1) создаем оболочку выпадающего списка
    const selectItemsWrapper = createSelectField();
    //2) создаем элементы списка - сюда придет ul + li (заголовок)
    const listWrapper = createList();
    //3) Создаем индивидуальный контент в элемент списка

    parentElement.closest('.select-users') ?
        addListContentForUsers(listWrapper) :
        addListContentForThemes(listWrapper, parentElement);

    selectItemsWrapper.insertAdjacentElement('beforeend', listWrapper);
    //4) задаем стили контейнеру
    setSelectFieldStyle(selectItemsWrapper, parentElement);
    //5) Показываем элемент
    elementAppearance(rootElement, selectItemsWrapper, 2 / 100);
    //6) Фокусируемся на элементе
    selectItemsWrapper.focus();
    //7) Устанавливаем событие потери фокуса - элемент исчезает
    selectItemsWrapper.addEventListener('focusout', () => { elementDisappearing(event.target, 2 / 100); });
}



const addListContentForThemes = async(listWrapper, targetItem) => {

    console.log(listWrapper)
        // listWrapper - элементы выпадающего меню
        // targetItem - элемент по которому кликнули

    // 1) загрузить темы из бд
    // 2) создать элементы списка
    // 3) заполнить элементы списка темами из бд
    // 4) навесить событие на элементы списка
    // 5) если выбрал элемент темы другая - то показать элемент с вводом темы и очистить элемент куда записывался id темы
    try {
        const themes = await settings.getAllTheme();
        themes.forEach(theme => {
            //тут мы добавили элементы выпадающего списка
            const listElement = document.createElement('li');
            listElement.classList.add('lContent');
            const listContent = `<span>${theme.theme}</span>`;
            listElement.insertAdjacentHTML('beforeend', listContent);
            listWrapper.insertAdjacentElement('beforeend', listElement);
            // теперь надо навесить события клика на эти элементы
            // метод который навесит событие клика на лишки с последующим заполнением нужных полей
            listElement.addEventListener('click', () => { addEventToSelectTheme(listElement, targetItem, theme) });
        });
        const listElementAlone = '<li class="lFooter"><span>Другая</span></li>';
        listWrapper.insertAdjacentHTML('beforeend', listElementAlone);
        listWrapper.addEventListener('click', () => { addEventToSelectComplects(listWrapper, event.target, targetItem) });
        return listWrapper;
    } catch (e) {}

}

const addEventToSelectTheme = (listContent, targetItem, item) => {
    const themeField = document.getElementById('theme');
    const selectWrapper = listContent.closest('.select-wrapper');
    const themeId = document.getElementById('themeId');
    [...targetItem.children][0].textContent = listContent.textContent;
    themeId.value = item._id;
    themeField.value = '';
    if (!themeField.classList.contains('toggleToHide')) {
        themeField.classList.toggle('toggleToHide');
    }
    elementDisappearing(selectWrapper, 2 / 100);
}

const addEventToSelectComplects = (listWrapper, target, parentElement) => {
    const selectWrapper = listWrapper.closest('.select-wrapper');
    const themeField = document.getElementById('theme');
    if (target.closest('.lHeader')) { //заголовок списка
        elementDisappearing(selectWrapper, 2 / 100)
    }
    if (target.closest('.lFooter')) { //заголовок списка
        console.log(111111);
        [...parentElement.children][0].textContent = target.textContent;
        themeId.value = '';
        if (themeField.classList.contains('toggleToHide')) {
            themeField.classList.toggle('toggleToHide');
        }
        elementDisappearing(selectWrapper, 2 / 100)
    }
}

const addListContentForUsers = async listWrapper => {
    try {
        const userAdminsArray = await settings.getAdmins();
        userAdminsArray.users.forEach(admin => {
            const listElement = document.createElement('li');
            listElement.classList.add('lContent');
            const listContent = `<span>${admin.email}</span>`;
            listElement.insertAdjacentHTML('beforeend', listContent);
            listWrapper.insertAdjacentElement('beforeend', listElement);

            listElement.addEventListener('click', () => { addEventToSelectUsers(event.target, admin); });
        })
    } catch (e) {}
}

const addEventToSelectUsers = (target, item) => {
    const userAdminIdField = document.getElementById('adminId');

    const toBtn = document.querySelector('.select-users');
    const selectUserWrapper = target.closest('.select-wrapper');
    [...toBtn.children][0].textContent = target.textContent;
    elementDisappearing(selectUserWrapper, 2 / 100);
    userAdminIdField.value = item.id;
}

const createNewTheme = async element => {
    const formSend = element.querySelector('.methods');
    // если текстовый элемент скрыт   
    if (formSend.elements.theme.classList.contains('toggleToHide')) {
        try {
            const result = await settings.updateTheme({
                themeId: formSend.elements.themeId.value,
                userId: formSend.elements.adminId.value,
            });
            toasts.createToastContainer(result.message)
        } catch (e) {}
    } else {
        try {
            const result = await settings.setTheme({
                themeName: formSend.elements.theme.value,
                userId: formSend.elements.adminId.value,
            });
            toasts.createToastContainer(result.message)
        } catch (e) {}
    }
}