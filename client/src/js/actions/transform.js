export const transformTableToRight = () => {
  const table = document.querySelector('.table');
  if (table) {
    table.classList.add('transform');
    let stepX = 0;
    const interval = setInterval(() => {
      if (stepX >= 100) {
        // table.classList.toggle('toggleToHide');
        table.style.transform = `translateX(-200%)`
        table.closest('#main-part').style.overflow = 'hidden'
        return clearInterval(interval)
      }
      table.style.transform = `translateX(${stepX}%)`
      stepX += 5
    }, 100 / 300)
  }
}

export const transformTableFromLeft = () => {
  const table = document.querySelector('.table');
  if (table && table.classList.contains('transform')) {
    let stepX = -200;
    table.classList.remove('transform');
    const interval = setInterval(() => {
      if (stepX >= 0) {
        table.style.transform = `translateX(0%)`
        return clearInterval(interval)
      }
      table.style.transform = `translateX(${stepX}%)`
      stepX += 5
    }, 100 / 300)
  }
}

export const transformChatFadeInFromLeft = () => {
  const chatWrapper = document.querySelector('.chat-wrapper');
  if (chatWrapper) {
    chatWrapper.dataset.chatHide = 0;
    let stepX = -100;
    chatWrapper.style.transform = `translateX(${stepX}%)`
    const interval = setInterval(() => {
      if (stepX >= 0) {
        chatWrapper.style.transform = `translateX(0%)`
        return clearInterval(interval)
      }
      chatWrapper.style.transform = `translateX(${stepX}%)`
      stepX += 5
    }, 100 / 300)
  }
}

export const transformChatFadeInFromRight = () => {
  const chatWrapper = document.querySelector('.chat-wrapper');
  if (chatWrapper) {
    chatWrapper.dataset.chatHide = 0;
    let stepX = 100;
    chatWrapper.style.transform = `translateX(${stepX}%)`
    chatWrapper.style.display = '';
    const interval = setInterval(() => {
      if (stepX <= 0) {
        chatWrapper.style.transform = `translateX(0%)`
        return clearInterval(interval)
      }
      chatWrapper.style.transform = `translateX(${stepX}%)`
      stepX -= 5
    }, 100 / 300)
  }
}

export const transformChatFadeOut = () => {
  const chatWrapper = document.querySelector('.chat-wrapper');
  if (chatWrapper) {
    let stepX = 0;
    const interval = setInterval(() => {
      if (stepX >= 100) {
        chatWrapper.style.display = 'none'; //*************************************
        chatWrapper.dataset.chatHide = 1;
        chatWrapper.style.transform = `translateX(100%)`
        chatWrapper.closest('#main-part').style.overflow = ''
        return clearInterval(interval)
      }
      chatWrapper.style.transform = `translateX(${stepX}%)`
      stepX += 5
    }, 100 / 300)
  }
}