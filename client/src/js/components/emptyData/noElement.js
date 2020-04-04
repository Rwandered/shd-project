export const createWrapper = () => {
  const container = document.createElement('div');
  container.classList.add('oops');
  container.style.opacity = 0;
  return container;
}

export const repositionContainer = (parentElement, container = parentElement.querySelector('.oops')) => {
  // const container = parentElement.querySelector('.oops');
  container.style.left = Math.round(parentElement.clientWidth / 2 - container.offsetWidth / 2) + 'px';
  window.addEventListener('resize', () => {
    // container.style.left = Math.round(parentElement.clientWidth / 2 - container.offsetWidth / 2) + 'px';
    container.style.left = Math.round(parentElement.clientWidth / 2 - container.offsetWidth / 2) + 'px';
  })
}