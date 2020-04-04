import {
    transformChatFadeOut,
    transformChatFadeInFromRight,
    transformTableFromLeft
} from "../../actions/transform.js";
import { renderChatMessage } from "./chatMessage.js";
import { DOCWRAPPER } from "../../constants/constants.js";
import { getMessage, sendMessage } from "../../webSockets/wsInteraction.js";
import { setCustomFooterStyles, setChatWrapperPosition, setDefaultChatWrapperStyles } from "./actionsWithChat/displayChat.js";


export const createChatWindow = dataForChat => {

    const mainPart = document.getElementById('main-part');
    //1 create chat wrapper
    const chatWrapper = createChatWrapper();
    //2 create chat header
    const chatHeader = createNewChatHeader(dataForChat);
    //3 create chat message
    const chatMessage = createNewChatMessage(dataForChat);
    //4 create chat footer
    const chatFooter = createChatFooter();
    //5 add all components to chat wrapper
    chatWrapper.insertAdjacentElement('afterbegin', chatHeader);
    chatWrapper.insertAdjacentElement('beforeend', chatMessage);
    chatWrapper.insertAdjacentElement('beforeend', chatFooter);
    //6 add chat wrapper to main part
    mainPart.insertAdjacentElement('beforeend', chatWrapper);
    //8 задаем высоту окна в зависимости от размера окна
    setCustomChatWrapperStyles(chatWrapper); // явно указываем высоту окна чата в 400пх
    //7 задаем пользовательские стили - то есть стили для подвала
    setCustomFooterStyles(chatWrapper);
    //8 задаем размеры и позиционирование для ресайзе основного окна
    window.addEventListener('resize', () => { resizePositionNew(chatWrapper) });
    setChatElementsEvents(chatWrapper);
    getMessage(dataForChat)

    return chatWrapper;
}

const createChatWrapper = () => {
    const chatWrapper = document.createElement('div');
    chatWrapper.classList.add('chat-wrapper', );
    chatWrapper.dataset.chatHide = 1;
    return chatWrapper;
}

//**********************************Заголовок чата */
const createNewChatHeader = dataForChat => {
    //1 создали еделмент шапки для чата
    const chatHeader = document.createElement('div')
        //2 добавили класс`
    chatHeader.classList.add('chat-header')
        //3 долбавили контент шапки
    const chatHeaderContent = `
        <p class="task-theme">${JSON.parse(dataForChat.dataset.taskContent).taskTheme}</p>
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
        transformChatFadeOut(); // -> скрываем окно чата 
        transformTableFromLeft(); // -> показываем таблицу
    }
}



const createNewChatMessage = dataForChat => {
    const dataTaskId = JSON.parse(dataForChat.dataset.taskContent).taskId;
    const chatMessage = document.createElement('div')
    chatMessage.classList.add('chat-message');
    chatMessage.dataset.messageTaskId = dataTaskId;

    return chatMessage;
}

const createChatFooter = () => {
    const chatFooter = document.createElement('div')
    chatFooter.classList.add('chat-footer')
    const chatFooterContent = `
        <textarea name="message" placeholder="ctrl+enter для отправки" class="chat-field-text-to-send"></textarea>
        <div class="chat-btn">
            <img class="attached" src="attached.png" alt="a">
            <img class="send" src="send-mess.png" alt="s">
        </div>`
    chatFooter.insertAdjacentHTML('afterbegin', chatFooterContent);

    return chatFooter;
}


export const setCustomChatWrapperStyles = chatWrapper => {
    //1 получаем родительский элемент
    const parentElement = chatWrapper.closest('#main-part');
    //2 задаем высоту окна чата относительно main part
    chatWrapper.style.height = Math.round(parentElement.offsetHeight - 100) + 'px';
    chatWrapper.style.cssText = `
        width: 500px;
        min-width: 50px;
        position: fixed;`
    chatWrapper.classList.add('elem-opacity')
}



const resizePositionNew = chatWrapper => {
    // 1 получаем элементы с которыми будум работать
    const parentElement = chatWrapper.closest('#main-part');
    const table = parentElement.querySelector('.table');

    if (DOCWRAPPER.offsetWidth > 1575) {
        if (+chatWrapper.dataset.chatHide === 0) {
            setDefaultChatWrapperStyles(chatWrapper)
                //если таблица скрыта
            if (table.classList.contains('transform')) {
                transformTableFromLeft();
                transformChatFadeInFromRight();
            }
        }
    } else if (DOCWRAPPER.offsetWidth <= 1575) {
        if (+chatWrapper.dataset.chatHide === 0) {
            setCustomChatWrapperStyles(chatWrapper)
            chatWrapper.classList.remove('elem-opacity')
            setChatWrapperPosition(chatWrapper, parentElement)
        }
    }
    setCustomFooterStyles(chatWrapper);
}

const setChatElementsEvents = chatWrapper => {
    chatWrapper.addEventListener('click', () => {
        switch (event.target) {
            case event.target.closest('.send'):
                sendTextChatMessage(chatWrapper)
                break;
            case event.target.closest('.attached'):
                break;
        }
    })

    chatWrapper.addEventListener('keydown', event => {
        if (event.ctrlKey && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
            sendTextChatMessage(chatWrapper)
        }
    })
}

export const addNewChatMessage = (chatWrapper, dataForChat) => {
    // console.log('Function addNewChatMessage: ', chatWrapper)
    const newChatMessage = createNewChatMessage(dataForChat);
    // console.log(newChatMessage)
    const oldChatHeader = chatWrapper.querySelector('.chat-header');
    oldChatHeader.insertAdjacentElement('afterend', newChatMessage)
    getMessage(dataForChat)
}

const sendTextChatMessage = chatWrapper => {
    const dataTaskContent = JSON.parse(chatWrapper.querySelector('.chat-header').dataset.taskContent);
    const messageField = chatWrapper.querySelector('.chat-field-text-to-send');

    if (messageField.value === '') return;
    const chatMessageContainers = document.querySelectorAll('.chat-message');
    const [chatMessageContainer] = [...chatMessageContainers].filter(elem => (elem.dataset.messageTaskId === dataTaskContent.taskId));

    const messageContent = messageField.value;
    messageField.value = '';
    const message = {
        creationDate: new Date(),
        taskId: dataTaskContent.taskId,
        howSender: dataTaskContent.fromUserId,
        howRecipient: dataTaskContent.toUserId,
        messageBody: messageContent,
    }
    const oops = chatMessageContainer.querySelector('.no-mess')

    if (oops) oops.remove();

    renderChatMessage([message], chatMessageContainer);
    sendMessage(message)
}