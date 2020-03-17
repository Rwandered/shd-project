import Loader from "./loader.js";
import Settings from "../requests/settings.js";
import { getUserId } from "../checking/checkAuth.js";
import { elementAppearance } from "../actions/visibility.js";
import { setCache, getCache, checkCache, getCaches } from '../actions/cache.js';
import { getUserName } from "../actions/caching.js";

const loader = new Loader();
const settings = new Settings();

export const renderChatMessage = async(wsAnswer, parentElement) => {
    loader.startLoader(parentElement);
    const chatWrapper = parentElement.closest('.chat-wrapper')

    parentElement.style.overflowX = 'auto'
    parentElement.style.opacity = '0'
    const dateSet = getDateWsAnswer(wsAnswer);

    // dateSet.forEach(date => {
    for (let date of dateSet) {
        // console.log(date);
        //1 create container for date chatting
        const dateChatContainer = createDateChatContainer(date, parentElement);
        //2 get array with date from ws answer
        const wsAnswerToDate = wsAnswer.filter(mess => {
            const messDate = getCustomDate(mess.creationDate);
            return messDate === date;
        });
        //3 create message container
        await createMessageContainer(wsAnswerToDate, dateChatContainer, parentElement)
    }
    elementAppearance(chatWrapper, parentElement, 5 / 300);
}

const setChatMessPosition = (positionableContainer, parentElement) => {
    const dataChatContainerWidth = parentElement.clientWidth - (parentElement.offsetWidth - parentElement.clientWidth)
    console.log(dataChatContainerWidth)
    positionableContainer.style.width = dataChatContainerWidth;
    positionableContainer.style.left = Math.round(parentElement.clientWidth / 2 - positionableContainer.offsetWidth / 2) + 'px';
}

const getDateWsAnswer = wsAnswer => {
    const dateSet = new Set()
    const dateArray = wsAnswer.map(e => getCustomDate(e.creationDate))
    dateArray.forEach(date => dateSet.add(date))
    return dateSet;
}

const getCustomDate = date => new Date(date).toLocaleDateString();
const getCustomTime = date => new Date(date).toLocaleTimeString();

export const clearChatField = () => {
    const chatMessageContainer = document.querySelector('.chat-message');
    [...chatMessageContainer.children].forEach(e => e.remove())
        // console.log(chatMessageContainer)
}

const createDateChatContainer = (date, parentElement) => {
    const dateChatContainer = document.createElement('div');
    dateChatContainer.style.cssText = `text-align:center; margin: 10px`;
    dateChatContainer.classList.add('date-chat-container');
    dateChatContainer.textContent = date;

    // const dateChatContent = document.createElement('p');
    // dateChatContent.style.cssText = ` position: relative; `
    parentElement.insertAdjacentElement('beforeend', dateChatContainer);
    setChatMessPosition(dateChatContainer, parentElement);
    return dateChatContainer;
}

const createMessageContainer = async(dateContainer, dateChatContainer, parentElement) => {

    for (let mess of dateContainer) {
        const user = await getUserName(mess.howSender);
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        messageContainer.style.cssText = `
            background-color: rgba(35, 37, 35, .3);
            color: #fff;
            border-radius: 5px;
            text-align: right;
            margin-top: 5px;
            padding: 5px;`

        if (mess.howSender === getUserId()) {
            messageContainer.style.textAlign = 'left'
        }

        const messageContent = ` 
            <p class="message-author" >${user.name}</p>
            <p class="message-value" >${mess.messageBody}</p>
            <p class="message-date" >${getCustomTime(mess.creationDate)}</p>`;
        messageContainer.insertAdjacentHTML('afterbegin', messageContent);
        // console.log(getCustomTime(mess.creationDate));
        dateChatContainer.insertAdjacentElement('beforeend', messageContainer);
        setChatMessPosition(dateChatContainer, parentElement)
    }
    // )
}