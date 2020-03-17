import { repositionContainer, createWrapper } from "./noElement";

export function createNoChattingMessContainer(parentElement, role) {
    // console.log(role)
    //1) создаем container 
    const container = createWrapper();
    //2) add logo oops
    const logoImg = createLogoImageOppsNoMess();
    //3) добавляем другие элементы в зависимости от роли
    const content = getOppsContent();

    container.insertAdjacentElement('beforeend', logoImg);
    container.insertAdjacentElement('beforeend', content);
    parentElement.insertAdjacentElement('beforeend', container);

    repositionContainer(parentElement);
    return container;
}

const createLogoImageOppsNoMess = () => {
    const logoImg = document.createElement('img')
    logoImg.src = './oops.png';
    logoImg.alt = 'No data';
    logoImg.style.width = '200px'
    logoImg.style.height = '200px'
    logoImg.classList.add('logo-img-oops')
    return logoImg;
}


const getOppsContent = () => {
    const wrapperContent = document.createElement('div');
    wrapperContent.classList.add('wrapperContent')
    const message = `<p>Для вас сообщений не найдено...</p>`;
    wrapperContent.insertAdjacentHTML('beforeend', message);
    return wrapperContent;
}