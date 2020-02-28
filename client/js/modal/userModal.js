import Toasts from '../components/toasts.js';
import Settings from '../requests/settings.js';
import { createModalContainer, createModalLayer, createModalHeader, createModalBtn, setCommonEvents, setCommonPosition } from './modalComm.js';

const toasts = new Toasts();
const settings = new Settings();

export const createUserModalWindow = modalContent => {

    // 1) создаем контейнер
    const modalContainer = createModalContainer();
    //2) создаем layer
    const modalLayer = createModalLayer();
    //3) созадем заголовок для модального окна
    const modalHeader = createModalHeader(modalContent.header);
    // 4) создаем модальное окно для создания пользователя
    const userModal = createUserModal(modalContent);
    //5) создаем элементы управления в модальном окне кнопки
    const modalBtn = createModalBtn(modalContent.header);

    //6) собираем все в контейнер 
    modalContainer.insertAdjacentHTML('beforeend', modalHeader);
    modalContainer.insertAdjacentHTML('beforeend', userModal);
    modalContainer.insertAdjacentElement('beforeend', modalBtn);

    //7) выводим все на экран
    document.body.insertAdjacentElement('beforeend', modalContainer);
    //8) задаем позиционирование контейнера общее
    setCommonPosition();
    //9) вешаем общие события
    setCommonEvents(modalContainer, modalLayer);
    //10) вешаем кастомные события
    setUserModalEvents(modalContainer)

    // console.log(modalContainer)
}

const createUserModal = modalContent => {
    const userModalContent = `
        <form action="" class="methods">
            <label for="${modalContent.contentName[0]}">${modalContent.labelName[0]}</label>
            <input type="${modalContent.type[0]}" name="${modalContent.contentName[0]}" id="${modalContent.contentName[0]}" placeholder="${modalContent.labelName[0]}">
            <label for="${modalContent.contentName[1]}">${modalContent.labelName[1]}</label>           
            <input type="${modalContent.type[0]}" name="${modalContent.contentName[1]}" id="${modalContent.contentName[1]}" placeholder="${modalContent.labelName[1]}">
            <label for="${modalContent.contentName[2]}">${modalContent.labelName[2]}</label>           
            <input type="${modalContent.type[1]}" name="${modalContent.contentName[2]}" id="${modalContent.contentName[2]}" placeholder="${modalContent.labelName[2]}">
        </form>`;

    return userModalContent;
}

const setUserModalEvents = element => {
    element.addEventListener('click', () => {
        if (event.target.tagName == 'BUTTON') {
            // console.log(event.target)
            createNewUser(element);
        }
    });
};

const createNewUser = async element => {
    const formSend = element.querySelector('.methods');
    // console.log(formSend)
    try {
        const result = await settings.setUser({
            name: formSend.elements.user.value,
            email: formSend.elements.email.value,
            password: formSend.elements.password.value,
        });
        toasts.createToastContainer(result.message)
    } catch (e) {}
}