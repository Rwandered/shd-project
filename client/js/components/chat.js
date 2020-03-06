import { DOCWRAPPER } from "./constants.js";
import {
    transformChatFadeOut,
    transformTableToRight,
    transformChatFadeInFromLeft,
    transformChatFadeInFromRight,
    transformTableFromLeft
} from "../actions/transform.js";



export const startChat = tableBody => {
    //1 проверка существует ли уже поле чата
    const chatWrapper = document.querySelector('.chat-wrapper')
    chatWrapper ?
        console.log('Обертка чата существует... нужно ее изменить и добавить поле ', chatWrapper) :
        createChatWindow();
}

export function createChatWindow() {
    const mainPart = document.getElementById('main-part')

    //1 create chat wrapper
    const chatWrapper = createChatWrapper();
    //2 create chat header
    const chatHeader = createChatHeader()
        //3 create chat message
    const chatMessage = createChatMessage();
    //4 create chat footer
    const chatFooter = createChatFooter();
    //5 add all components to chat wrapper
    chatWrapper.insertAdjacentElement('afterbegin', chatHeader);
    chatWrapper.insertAdjacentElement('beforeend', chatMessage);
    chatWrapper.insertAdjacentElement('beforeend', chatFooter);
    //6 add chat wrapper to main part
    mainPart.insertAdjacentElement('afterbegin', chatWrapper);
    //8 задаем изначальное позиционирование в зависимости от размера окна
    setCustomPosition(chatWrapper);
    //7 задаем пользовательские стили - то есть стили для подвала
    setCustomStyles(chatWrapper);
    //8 задаем размеры и позиционирование для ресайзе основного окна
    window.addEventListener('resize', () => { resizePosition(chatWrapper) });

    return chatWrapper;
}


function createChatWrapper() {
    const chatWrapper = document.createElement('div');
    chatWrapper.classList.add('chat-wrapper', 'float-right');
    chatWrapper.style.cssText = `
        width: 500px;
        min-width: 50px;
        position: relative;
        left: 0;`
    return chatWrapper;
}


function createChatHeader() {
    //1 создали еделмент шапки для чата
    const chatHeader = document.createElement('div')
        //2 добавили класс
    chatHeader.classList.add('chat-header')
        //3 долбавили контент шапки
    const chatHeaderContent = `
        <p class="task-theme">Task theme</p>
        <img class="to-back rotate" src="closeWindow.png" alt="Назад">`;
    //4 добавили в шапку контент    
    chatHeader.insertAdjacentHTML('afterbegin', chatHeaderContent);
    //5 навесили события на шапку
    chatHeader.addEventListener('click', () => { setChatHeaderEvents(event.target) });
    return chatHeader;
}


const setChatHeaderEvents = chatHeaderItem => {
    if (chatHeaderItem.classList.contains('to-back')) {
        //при клике на кнопку закрыть  - форма чата уходит вправо таблица выходит слева
        transformChatFadeOut();
        transformTableFromLeft();
    }
}


function createChatMessage() {
    const chatMessage = document.createElement('div')
    chatMessage.classList.add('chat-message')
    return chatMessage;
}

function createChatFooter() {
    const chatFooter = document.createElement('div')
    chatFooter.classList.add('chat-footer')

    const chatFooterContent = `
        <textarea name="message" class="chat-field-text-to-send"></textarea>
        <div class="chat-btn">
            <img class="attached" src="attached.png" alt="">
            <img class="send" src="send-mess.png" alt="">
        </div>
        `
    chatFooter.insertAdjacentHTML('afterbegin', chatFooterContent)
    return chatFooter;
}


const setCustomStyles = chatWrapper => {
    //в этом методе задаются стили для позиционирования элементов внутри chatField
    const chatFooter = chatWrapper.querySelector('.chat-footer');
    const txtField = chatFooter.querySelector('.chat-field-text-to-send')
    const btnContainer = chatFooter.querySelector('.chat-btn')

    btnContainer.style.top = btnContainer.offsetHeight / 4 + 'px';
    txtField.style.width = `${chatFooter.offsetWidth - btnContainer.offsetWidth - 15}px`;

}

const setCustomPosition = chatWrapper => {
    //1 получаем родительский элемент
    const parentElement = chatWrapper.closest('#main-part');
    parentElement.style.overflow = 'hidden';
    //2 задаем высоту окна чата относительно main part
    chatWrapper.style.height = Math.round(parentElement.offsetHeight - 100) + 'px';
    if (DOCWRAPPER.offsetWidth <= 1650) {
        setPosition(chatWrapper, parentElement);
        //показываем окно чата слева направо
        transformChatFadeInFromLeft();
    } else {
        //если размер нормальный то просто 
        transformChatFadeInFromRight();
    }
}

const setPosition = (chatWrapper, parentElement, table = parentElement.querySelector('.table')) => {
    if (!table.classList.contains('tranform')) {
        transformTableToRight();
    }
    chatWrapper.classList.remove('float-right');
    chatWrapper.style.left = Math.round(parentElement.clientWidth / 2 - chatWrapper.offsetWidth / 2) + 'px';
    if (parentElement.clientWidth <= 520) {
        parentElement.style.overflow = '';
        const scrollBarWidth = parentElement.offsetWidth - parentElement.clientWidth
        const activePartParentElement = parentElement.clientWidth - scrollBarWidth
        chatWrapper.style.width = activePartParentElement + 'px'
        chatWrapper.style.left = Math.round(parentElement.clientWidth / 2 - chatWrapper.offsetWidth / 2 - 5) + 'px';
    }
}



const resizePosition = chatWrapper => {
    chatWrapper.style.cssText = `
                width: 500px;
                min-width: 50px;
                position: relative;
                left: 0;`
        // 1 получаем элементы с которыми будум работать
    const parentElement = chatWrapper.closest('#main-part');
    const table = parentElement.querySelector('.table');

    if (DOCWRAPPER.offsetWidth > 1650) {
        chatWrapper.classList.add('float-right');
        parentElement.style.overflow = 'hidden';

        if (table.classList.contains('transform')) {
            transformTableFromLeft();
            transformChatFadeInFromRight();
        }
    } else if (DOCWRAPPER.offsetWidth <= 1650) {
        setPosition(chatWrapper, parentElement, table)
    }
    setCustomStyles(chatWrapper);
}