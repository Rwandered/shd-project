import Toasts from '../toasts/toasts.js';
import Settings from '../../requests/settings.js';
import {elementAppearance, elementDisappearing} from '../../actions/visibility.js';
import {createList, createSelectField, setSelectFieldStyle} from '../select/selectElement.js';
import {
  createModalBtn,
  createModalContainer,
  createModalHeader,
  createModalLayer,
  setCommonEvents,
  setCommonPosition
} from './modalCommon.js';


const toasts = new Toasts();
const settings = new Settings();

export const createRoleModalWindow = modalContent => {

  const modalContainer = createModalContainer();
  const modalLayer = createModalLayer();
  const modalHeader = createModalHeader(modalContent.header);
  const roleModal = createRoleModal(modalContent);
  const modalBtn = createModalBtn(modalContent.header);

  modalContainer.insertAdjacentHTML('beforeend', modalHeader);
  modalContainer.insertAdjacentHTML('beforeend', roleModal);
  modalContainer.insertAdjacentElement('beforeend', modalBtn);

  document.body.insertAdjacentElement('beforeend', modalContainer);
  setCommonPosition();
  setCommonEvents(modalContainer, modalLayer);
  setRoleModalEvents(modalContainer)
}


const createRoleModal = modalContent => {
  return `
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
}


const setRoleModalEvents = element => {
  element.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      createNewRole(element);
    } else if (event.target.closest('.select-item')) {
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
  const selectItemsWrapper = createSelectField();
  const listWrapper = createList();

  parentElement.closest('.select-users') ?
    addListContentForUsers(listWrapper) :
    addListContentForRoles(listWrapper, parentElement);

  selectItemsWrapper.insertAdjacentElement('beforeend', listWrapper);
  setSelectFieldStyle(selectItemsWrapper, parentElement);
  elementAppearance(rootElement, selectItemsWrapper, 2 / 100);
  selectItemsWrapper.focus();

  selectItemsWrapper.addEventListener('focusout', () => { elementDisappearing(event.target, 2 / 100); });
}



const addListContentForRoles = (listWrapper, targetItem) => {
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