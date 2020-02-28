import { renderTaskModalWindow } from '../modal/taskWindow.js';
import { getUserId } from '../checking/checkAuth.js';

export function createNoElementContainer(parentElement, role) {
    //1) создаем container 
    const container = createWrapper(parentElement);
    //2) add logo oops
    const logoImg = document.createElement('img')
    logoImg.src = './oops.png';
    logoImg.alt = 'No data';
    //3) добавляем другие элементы в зависимости от роли
    const content = getOppsContent(role);
    container.insertAdjacentElement('beforeend', logoImg);
    container.insertAdjacentElement('beforeend', content);
    parentElement.insertAdjacentElement('beforeend', container);

    repositionContainer(parentElement);
    return container;
}

const createWrapper = parentElement => {
    const container = document.createElement('div');
    container.classList.add('oops');
    container.style.opacity = 0;
    return container;
}

const repositionContainer = parentElement => {
    const container = parentElement.querySelector('.oops');
    container.style.left = Math.round(parentElement.clientWidth / 2 - container.offsetWidth / 2) + 'px';
    window.addEventListener('resize', () => {
        container.style.left = Math.round(parentElement.clientWidth / 2 - container.offsetWidth / 2) + 'px';
    })
}

const getOppsContent = role => {
    const wrapperContent = document.createElement('div');
    wrapperContent.classList.add('wrapperContent')
    const message = `<p>Для вас задачи не найдены...</p>`;
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