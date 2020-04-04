import '../styles/css/reset.css';
import '../styles/css/common.css';
import Task from './requests/tasks.js';
import Table from './components/table/table.js';
import LocalAuth from './checking/checkAuth.js';
import Loader from './components/loader/loader.js';
import { elementAppearance } from './actions/visibility.js';
import { repeatingUpdate } from './actions/updateRender';
import { createNoElementContainer } from './components/tasks/emptyTaskField.js';
import { createRoleModalWindow } from './components/modalWindows/roleModalWindow.js';
import { createThemeModalWindow } from './components/modalWindows/themeModalWindow.js';
import { createUserModalWindow } from './components/modalWindows/userModalWindow.js';



const localAuth = new LocalAuth();
const loader = new Loader();
const task = new Task();
const table = new Table();

localAuth.checkAuth(window.location.pathname);

const crThemeBtn = document.getElementById('crTheme');
const crRoleBtn = document.getElementById('crRole');
const crUserBtn = document.getElementById('crUser');
const tableField = document.getElementById('main-part');
const exitBtn = document.getElementById('exit');


const createTheme = async() => {
  try {
    const modalContent = {
      header: event.target.textContent,
      labelName: ['Theme', 'Admin user'],
      type: ['text', 'text'],
      contentName: ['theme', 'adminId'],
      modalType: 'theme',
    }
    createThemeModalWindow(modalContent);
  } catch (e) {}
}

const createRole = () => {
  try {
    const modalContent = {
      header: event.target.textContent,
      labelName: ['User', 'Role'],
      type: ['text', 'text'],
      contentName: ['user', 'role', 'userId'],
      modalType: 'role',
    }

    createRoleModalWindow(modalContent);
  } catch (e) {}
}

const createUser = () => {
  try {
    const modalContent = {
      header: event.target.textContent,
      labelName: ['User name', 'Email', 'Password'],
      type: ['text', 'password'],
      contentName: ['user', 'email', 'password'],
      modalType: 'user',
    }
    createUserModalWindow(modalContent)
  } catch (e) {}
}


const getTasks = async() => {
  loader.startLoader(tableField);
  const result = await task.getAllTask();

  const formElement = result.length == 0 ?
    createNoElementContainer(tableField, '') :
    await table.renderTable(result);
  elementAppearance(tableField, formElement, 1 / 300);
}

const repeatingUpdateTask = () => repeatingUpdate(getTasks);



document.addEventListener('DOMContentLoaded', getTasks);
crThemeBtn.addEventListener('click', createTheme)
crRoleBtn.addEventListener('click', createRole)
crUserBtn.addEventListener('click', createUser)
exitBtn.addEventListener('click', localAuth.stopSession);


repeatingUpdateTask();