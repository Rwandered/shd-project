import '../styles/css/reset.css';
import '../styles/css/common.css';
import Task from './requests/tasks.js';
import Table from './components/table/table.js';
import LocalAuth, { getUserId } from './checking/checkAuth.js';
import Loader from './components/loader/loader.js';
import { elementAppearance } from './actions/visibility.js';
import { createNoElementContainer } from './components/tasks/emptyTaskField.js';
import { renderTaskModalWindow } from './components/modalWindows/taskModalWindow.js';


const loader = new Loader();
const task = new Task();
const table = new Table();
const localAuth = new LocalAuth();


localAuth.checkAuth(window.location.pathname);


const tableField = document.getElementById('main-part');
const exitBtn = document.getElementById('exit');
const crTask = document.getElementById('crTask');

const getTasks = async() => {
  loader.startLoader(tableField);
  const result = await task.getTaskForRole(getUserId());
  const formElement = result.userTasks.length == 0 ?
    createNoElementContainer(tableField, result.userRole) :
    await table.renderTable(result.userTasks);

  elementAppearance(tableField, formElement, 1 / 300);
}

const createTask = () => {
  renderTaskModalWindow(getUserId(), event.target.textContent);
}


document.addEventListener('DOMContentLoaded', getTasks);
exitBtn.addEventListener('click', localAuth.stopSession);
crTask.addEventListener('click', createTask);
// crFilter.addEventListener('click', createChatWindow)