import { createNoChattingMessContainer } from "../components/chat/emptyChattingMess.js";
import { renderChatMessage } from "../components/chat/chatMessage.js";
import Toasts from "../components/toasts/toasts.js";
import { displayNewTask } from "../components/tasks/actionsWithTasks/displayNewTask.js";
import { changeMessCounter } from "../components/chat/actionsWithChat/changeMessageCounter.js";
import { displayNewStatusTask } from "../components/tasks/actionsWithTasks/displayNewStatusTask.js";


export const handleWsEvent = wsEvent => {
  const wsAnswer = JSON.parse(wsEvent.data);
  const chatMessageContainers = document.querySelectorAll('.chat-message');
  const [chatMessageContainer] = [...chatMessageContainers].filter(elem => (elem.dataset.messageTaskId === wsAnswer.taskId));

  switch (wsAnswer.event) {
    case 'getMessage':
      wsAnswer.data === 'No data' ?
        createNoChattingMessContainer(chatMessageContainer) :
        renderChatMessage(wsAnswer.data, chatMessageContainer);
      break;
    case 'setMessage':
      renderChatMessage(wsAnswer.data, chatMessageContainer);
      changeMessCounter(wsAnswer.data[0])
      new Toasts().createToastContainer('Новое сообщение к задаче ' + wsAnswer.data[0].taskId)
      break;
    case 'newTask':
      const [userTask] = wsAnswer.data
        // console.log(userTask)
      displayNewTask(userTask);
      break;
    case 'newTaskStatus':
      // console.log(wsAnswer)
      displayNewStatusTask(wsAnswer)
      break;
  }
}