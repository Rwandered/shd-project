export const changeMessCounter = wsAnswerData => {

  //если открыт элемент чата - то изменять этот счетчик не нужно
  const chatMessages = document.querySelectorAll('.chat-message')
  const [chatMessage] = [...chatMessages].filter(chatMessage => chatMessage.dataset.messageTaskId === wsAnswerData.taskId)

  const chatWrapper = chatMessage.closest('.chat-wrapper')
  if (+chatWrapper.dataset.chatHide === 1) {
    const tableBodies = document.querySelectorAll('.tableBody')
    const [tableBody] = [...tableBodies].filter(tableBody => JSON.parse(tableBody.dataset.taskContent).taskId === wsAnswerData.taskId)
      // console.log(tableBody)
    let counter = tableBody.querySelector('.mess-counter');
    counter.textContent = +counter.textContent + 1;
  }
}

export const clearChatMessageCounter = elemCounter => elemCounter.querySelector('.mess-counter').textContent = '';