import { getUserId } from "../../checking/checkAuth.js";
import { getUserName } from "../../actions/caching.js";

export const renderChatMessage = async(wsAnswer, parentElement) => {
  const oopsElem = parentElement.querySelector('.no-mess')
  if (oopsElem) oopsElem.remove();

  parentElement.style.overflowX = 'auto'
  const dateSet = getDateWsAnswer(wsAnswer);
  for (let date of dateSet) {
    //1 create container for date chatting
    const dateChatContainer = getDateChatContainer(date, parentElement)
      //2 get array with date from ws answer
    const wsAnswerToDate = wsAnswer.filter(mess => {
      const messDate = getCustomDate(mess.creationDate);
      return messDate === date;
    });
    //3 create message container
    await createMessageContainer(wsAnswerToDate, dateChatContainer, parentElement);
  }

}


const getDateWsAnswer = wsAnswer => {
  const dateSet = new Set()
  const dateArray = wsAnswer.map(e => getCustomDate(e.creationDate))
  dateArray.forEach(date => dateSet.add(date))
  return dateSet;
}

const getCustomDate = date => new Date(date).toLocaleDateString();
const getCustomTime = date => new Date(date).toLocaleTimeString();


const createDateChatContainer = (date, parentElement) => {
  const dateChatContainer = document.createElement('div');
  dateChatContainer.style.cssText = `text-align:center; margin: 10px`;
  dateChatContainer.classList.add('date-chat-container');
  dateChatContainer.textContent = date;
  dateChatContainer.dataset.taskDate = date;

  parentElement.insertAdjacentElement('beforeend', dateChatContainer);

  return dateChatContainer;
}


const getDateChatContainer = (date, parentElement) => {
  const dateChatContainers = parentElement.querySelectorAll('.date-chat-container')
  const dateChatContainer = [...dateChatContainers].filter(container => container.dataset.taskDate === date)

  if (dateChatContainer.length != 0) {
    return dateChatContainer[0];
  }
  return createDateChatContainer(date, parentElement);
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
    dateChatContainer.insertAdjacentElement('beforeend', messageContainer);
  }
  await (parentElement.scrollTop = parentElement.scrollHeight)
}