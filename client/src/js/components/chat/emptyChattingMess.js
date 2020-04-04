import { createWrapper, repositionContainer } from "../emptyData/noElement";

export function createNoChattingMessContainer(parentElement) {
  //1) создаем container 
  const container = createWrapper();
  container.className = 'no-mess'
    //2) add logo oops
  const logoImg = createLogoImageOppsNoMess();
  //3) добавляем другие элементы в зависимости от роли
  const content = getOppsContent();

  container.insertAdjacentElement('beforeend', logoImg);
  container.insertAdjacentElement('beforeend', content);
  parentElement.insertAdjacentElement('beforeend', container);

  repositionContainer(parentElement, container);

  parentElement.style.display = 'none'; ///*/****************************** */

  container.style.opacity = 1;
  return container;
}

const createLogoImageOppsNoMess = () => {
  const logoImg = document.createElement('img')
  logoImg.src = 'oops.png';
  logoImg.alt = 'No data';
  logoImg.style.width = '150px'
  logoImg.style.height = '150px'
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