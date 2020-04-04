export default class Toasts {

  createToastContainer(message) {
    const toastContainer = document.querySelector('.toast-container');
    if (toastContainer) {
      createToast(message)
    } else {
      const toastContainer = document.createElement('div');
      toastContainer.classList.add('toast-container');
      document.body.insertAdjacentElement('beforeend', toastContainer);
      createToast(message);
    }
  }
}

const fadeIn = elem => {
  const step = 1 / 300;
  let stepY = 200;
  elem.style.transform = `translateY(${stepY}px)`
  const interval = setInterval(() => {
    if (stepY <= 0) {
      elem.style.transform = 'translateY(0px)'
      elem.style.opacity = 1;
      clearInterval(interval);
      fadeOut(elem);
    }
    stepY -= 3
    elem.style.transform = `translateY(${stepY}px)`
    elem.style.opacity = +elem.style.opacity + step;
  }, 500 / 1000)
}

const moveToast = toast => {
  let stepY = -4;
  const interval = setInterval(() => {
    if (stepY <= 0) {
      toast.style.transform = 'translateY(0px)'
      clearInterval(interval);
    }
    stepY -= 3
    toast.style.transform = `translateY(${stepY}px)`
  }, 500 / 1000)
}

const removeToast = elem => {
  setTimeout(() => {
    if (elem.parentNode.children.length === 1) {
      elem.parentNode.remove();
    }
    elem.remove();
  }, 5000);
}

const fadeOut = elem => {
  const step = 10 / 300;
  let stepY = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      if (+elem.style.opacity <= 0) {
        removeToast(elem);
        clearInterval(interval);
      }
      stepY -= 2
      elem.style.transform = `translateY(${stepY}px)`
      elem.style.opacity = +elem.style.opacity - step;
    }, 300 / 1000)
  }, 4000);
}


const createToast = message => {
  const toastContainer = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.style.cssText = `
        margin-top: 5px;
        opacity: 0;
        transform: translateY(50px);`
  toast.textContent = message;
  toastContainer.insertAdjacentElement('beforeend', toast);
  fadeIn(toast);
}