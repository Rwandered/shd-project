import { setCustomChatWrapperStyles } from "../chatWrapper.js"
import { DOCWRAPPER } from "../../../constants/constants.js"
import { transformTableToRight, transformChatFadeInFromLeft, transformChatFadeInFromRight } from "../../../actions/transform.js"
import { clearChatMessageCounter } from "./changeMessageCounter.js"


export const showChat = (dataForChat, tdCounter) => {
    const chatWrapper = document.querySelector('.chat-wrapper')
    const mainWrapper = chatWrapper.closest('#main-part')
    const docWrapperSizeWidth = DOCWRAPPER.offsetWidth;

    updateChatHeader(chatWrapper, dataForChat)
    showChatMessage(chatWrapper, dataForChat)

    if (docWrapperSizeWidth <= 1575) {
        chatWrapper.style.opacity = 1;
        chatWrapper.style.display = '';
        setChatWrapperPosition(chatWrapper, mainWrapper);

        transformChatFadeInFromLeft()
    } else {
        setDefaultChatWrapperStyles()
        transformChatFadeInFromRight();
    }
    clearChatMessageCounter(tdCounter);
}


export const setChatWrapperPosition = (chatWrapper, parentElement, table = parentElement.querySelector('.table')) => {
    if (!table.classList.contains('tranform')) {
        transformTableToRight();
    }
    chatWrapper.style.left = Math.round(parentElement.clientWidth / 2 - chatWrapper.offsetWidth / 2) + 'px';

    if (parentElement.clientWidth <= 520) {
        parentElement.style.overflow = '';
        const scrollBarWidth = parentElement.offsetWidth - parentElement.clientWidth
        const activePartParentElement = parentElement.clientWidth - scrollBarWidth
        chatWrapper.style.width = activePartParentElement + 'px'
        chatWrapper.style.left = Math.round(parentElement.clientWidth / 2 - chatWrapper.offsetWidth / 2) + 'px';
    }
    setCustomFooterStyles(chatWrapper)
}


export const setCustomFooterStyles = chatWrapper => {

    const chatFooter = chatWrapper.querySelector('.chat-footer');
    const txtField = chatFooter.querySelector('.chat-field-text-to-send')
    const btnContainer = chatFooter.querySelector('.chat-btn')

    btnContainer.style.top = btnContainer.offsetHeight / 4 + 'px';
    txtField.style.width = `${chatFooter.offsetWidth - btnContainer.offsetWidth - 15}px`;
}

const updateChatHeader = (chatWrapper, dataForChat) => {
    const taskContentForChat = JSON.parse(dataForChat.dataset.taskContent);
    const newTaskContentForChat = {
        taskId: taskContentForChat.taskId,
        fromUserId: getSender(taskContentForChat),
        toUserId: getRecipient(taskContentForChat),
    }
    const chatHeader = chatWrapper.querySelector('.chat-header');
    const newTaskTheme = taskContentForChat.taskTheme;
    chatHeader.dataset.taskContent = JSON.stringify(newTaskContentForChat);
    chatHeader.querySelector('.task-theme').textContent = `${newTaskTheme}`;
}

const getSender = taskContentForChat => taskContentForChat.userRole === 'user' ? taskContentForChat.fromUserId : taskContentForChat.toUserId
const getRecipient = taskContentForChat => taskContentForChat.userRole === 'user' ? taskContentForChat.toUserId : taskContentForChat.fromUserId
const getTaskId = dataForChat => JSON.parse(dataForChat.dataset.taskContent).taskId;


const showChatMessage = (chatWrapper, dataForChat) => {
    const taskId = getTaskId(dataForChat)
    const chatMessages = [...chatWrapper.querySelectorAll('.chat-message')]
    const [chatMessage] = chatMessages.filter(chatMess => {
        chatMess.style.display = 'none'; // делает дисплей нон всем  элементам
        return chatMess.dataset.messageTaskId === taskId
    })

    chatMessage.style.display = '';
    chatMessage.scrollTop = chatMessage.scrollHeight
}

export const setDefaultChatWrapperStyles = () => {
    const chatWrapper = document.querySelector('.chat-wrapper')

    if (chatWrapper) {
        const mainPart = chatWrapper.closest('#main-part');
        setCustomChatWrapperStyles(chatWrapper)
        chatWrapper.style.top = Math.round(mainPart.offsetTop + 5) + 'px' //'82px';
        chatWrapper.style.left = Math.round(mainPart.offsetWidth - 500 - (mainPart.offsetWidth - mainPart.clientWidth) - 5) + 'px' //'1390px'
        chatWrapper.classList.remove('elem-opacity')
    }
}