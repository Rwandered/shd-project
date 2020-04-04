import Toasts from '../toasts/toasts.js';
import Settings from '../../requests/settings.js';
import { elementAppearance, elementDisappearing } from '../../actions/visibility.js';
import { createSelectField, createList, setSelectFieldStyle } from '../select/selectElement.js';
import {
  createModalContainer,
  createModalLayer,
  createModalHeader,
  createModalBtn,
  setCommonEvents,
  setCommonPosition
} from './modalCommon.js';





const toasts = new Toasts();
const settings = new Settings();

export const createRoleModalWindow = modalContent => {
  // 1) создаем контейнер
  const modalContainer = createModalContainer();
  //2) создаем layer
  const modalLayer = createModalLayer();
  //3) созадем заголовок для модального окна
  const modalHeader = createModalHeader(modalContent.header);
  // 4) создаем модальное окно для задания роли
  const roleModal = createRoleModal(modalContent);
  //5) создаем элементы управления в модальном окне кнопки
  const modalBtn = createModalBtn(modalContent.header);

  //6) собираем все в контейнер 
  modalContainer.insertAdjacentHTML('beforeend', modalHeader);
  modalContainer.insertAdjacentHTML('beforeend', roleModal);
  modalContainer.insertAdjacentElement('beforeend', modalBtn);

  //7) выводим все на экран
  document.body.insertAdjacentElement('beforeend', modalContainer);
  //8) задаем позиционирование контейнера общее
  setCommonPosition();
  //9) вешаем общие события
  setCommonEvents(modalContainer, modalLayer);
  //10) вешаем кастомные события
  setRoleModalEvents(modalContainer)

  // console.log(modalContainer)
}


const createRoleModal = modalContent => {
  const roleModalContent = `
        <form action="" class="methods">
            <label for="${modalContent.contentName[0]}">${modalContent.labelName[0]}</label>
            <div class="select-users select-item">
                <p>Выберите ${modalContent.contentName[0]}</p>
                <span>▼</spans>                
            </div>
            <label for="${modalContent.contentName[1]}">${modalContent.labelName[1]}</label>           
            <div class="select-role select-item">  
                <p>Выберите ${modalContent.contentName[1]}</p>
                <span>▼</spans>
            </div>
            <input type="${modalContent.type[2]}" name="${modalContent.contentName[2]}" id="${modalContent.contentName[2]}" hidden>
        </form>`;
  return roleModalContent;
}


const setRoleModalEvents = element => {
  element.addEventListener('click', () => {
    if (event.target.tagName == 'BUTTON') {
      // console.log(event.target)
      createNewRole(element);
    } else if (event.target.closest('.select-item')) {
      //тут навешивается событие по созданию выпадающего меню
      const selectItem = event.target.closest('.select-item');
      createSelectUserField(selectItem);
    }
  });
};


const createSelectUserField = parentElement => {
  // parentElement - относительно чего создавать элемент списка - по чему произошел клик
  // rootElement - основной контейнер модального окна
  // основной контейнер модального окна
  const rootElement = document.querySelector('.modalWindow-wrapper');
  //1) создаем оболочку выпадающего списка
  const selectItemsWrapper = createSelectField();
  //2) создаем элементы списка - сюда придет ul + li (заголовок)
  const listWrapper = createList();
  //3) Создаем индивидуальный контент в элемент списка
  parentElement.closest('.select-users') ?
    addListContentForUsers(listWrapper) :
    addListContentForRoles(listWrapper, parentElement);

  selectItemsWrapper.insertAdjacentElement('beforeend', listWrapper);
  //4) задаем стили контейнеру
  setSelectFieldStyle(selectItemsWrapper, parentElement);
  //5) Показываем элемент
  elementAppearance(rootElement, selectItemsWrapper, 2 / 100);
  //6) Фокусируемся на элементе
  selectItemsWrapper.focus();
  //7) Устанавливаем событие потери фокуса - элемент исчезает
  selectItemsWrapper.addEventListener('focusout', () => { elementDisappearing(event.target, 2 / 100); });
}



const addListContentForRoles = (listWrapper, targetItem) => {
  // listWrapper - элементы выпадающего меню
  // targetItem - элемент по которому кликнули
  // console.log(listWrapper);
  const roleContent = `
        <li class="lContent"><span>Admin</span></li>
        <li class="lContent"><span>Root</span></li>
        <li class="lContent"><span>User</span></li>`
  listWrapper.insertAdjacentHTML('beforeend', roleContent)
    //далее тут событие для кликов по элементам выпадающего меню  
  listWrapper.addEventListener('click', () => { addEventToSelectRole(event.target, targetItem) });
}

const addEventToSelectRole = (listContent, targetItem) => {
  const selectWrapper = listContent.closest('.select-wrapper');
  if (listContent.closest('.lHeader')) { //заголовок списка
    elementDisappearing(selectWrapper, 2 / 100)
  }
  if (listContent.closest('.lContent')) { //'элементы' списка
    [...targetItem.children][0].textContent = listContent.textContent;
    elementDisappearing(selectWrapper, 2 / 100)
  }
}


const addListContentForUsers = async listWrapper => {
  try {
    const userArray = await settings.getUsers();
    userArray.users.forEach(user => {
      const listElement = document.createElement('li');
      listElement.classList.add('lContent');
      const listContent = `<span>${user.email}</span>`;
      listElement.insertAdjacentHTML('beforeend', listContent);
      listWrapper.insertAdjacentElement('beforeend', listElement);

      listElement.addEventListener('click', () => { addEventToSelectUsers(event.target, user); });
    })
  } catch (e) {}
}


const addEventToSelectUsers = (target, item) => {
  const userIdField = document.getElementById('userId');
  // console.log(item, userIdField)
  const toBtn = document.querySelector('.select-users');
  const selectUserWrapper = target.closest('.select-wrapper');
  [...toBtn.children][0].textContent = target.textContent;
  elementDisappearing(selectUserWrapper, 2 / 100);
  userIdField.value = item.id;
}


const createNewRole = async element => {
  const formSend = element.querySelector('.methods');
  const role = element.querySelector('.select-role p').textContent.toLowerCase();
  try {
    const result = await settings.setRole({
      userId: formSend.elements.userId.value,
      role: role,
    });
    toasts.createToastContainer(result.message)
  } catch (e) {}
}