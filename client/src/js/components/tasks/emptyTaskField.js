import { getUserId } from '../../checking/checkAuth.js';
import { renderTaskModalWindow } from '../modalWindows/taskModalWindow.js';
import { createWrapper, repositionContainer } from '../emptyData/noElement.js';


export function createNoElementContainer(parentElement, role) {
  //1) создаем container 
  const container = createWrapper();
  //2) add logo oops
  const logoImg = createLogoImageOppsNoTask();
  //3) добавляем другие элементы в зависимости от роли
  const content = getOppsContent(role);
  container.insertAdjacentElement('beforeend', logoImg);
  container.insertAdjacentElement('beforeend', content);
  parentElement.insertAdjacentElement('beforeend', container);
  repositionContainer(parentElement);

  return container;
}

const createLogoImageOppsNoTask = () => {
  const logoImg = document.createElement('img')
  logoImg.src = './oops.png';
  logoImg.alt = 'No data';
  return logoImg
}


const getOppsContent = role => {
  const wrapperContent = document.createElement('div');
  wrapperContent.classList.add('wrapperContent')
  const message = `<p>Для вас задач не найдено...</p>`;
  wrapperContent.insertAdjacentHTML('beforeend', message);
  if (role === 'user') {
    const content = `<button class='btn btn-crTask'>Создать задачу</button>`
    wrapperContent.insertAdjacentHTML('beforeend', content);
    eventWatcher(wrapperContent); //добавим события на кнопку
    return wrapperContent;
  }
  return wrapperContent;
}


const eventWatcher = parentElement => {
  const crTask = parentElement.querySelector('.btn-crTask');
  crTask.addEventListener('click', () => { renderTaskModalWindow(getUserId(), event.target.textContent) });
}