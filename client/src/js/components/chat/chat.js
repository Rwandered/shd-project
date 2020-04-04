import { socket } from "../../webSockets/connectionWs.js";
import { handleWsEvent } from "../../webSockets/handleWsEvent.js";
import { createChatWindow, addNewChatMessage } from "./chatWrapper.js";


const createSocketEvents = () => {
  socket.addEventListener('message', event => { handleWsEvent(event) });
}
createSocketEvents();


export const startChat = tableBody => {
  // 1 проверка существует ли уже поле чата
  const chatWrapper = document.querySelector('.chat-wrapper')
  chatWrapper ?
    addNewChatMessage(chatWrapper, tableBody) :
    createChatWindow(tableBody);
}