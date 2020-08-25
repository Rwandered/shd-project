import '../styles/css/reset.css';
import '../styles/css/common.css';
import LocalAuth, { getUserId } from './checking/checkAuth.js';
import { renderTaskModalWindow } from './components/modalWindows/taskModalWindow.js';
import {getTasks} from "./utils";



const localAuth = new LocalAuth();


localAuth.checkAuth(window.location.pathname);
const exitBtn = document.getElementById('exit');
const crTask = document.getElementById('crTask');

const createTask = (event) => {
  renderTaskModalWindow(getUserId(), event.target.textContent);
}

document.addEventListener('DOMContentLoaded', getTasks);
exitBtn.addEventListener('click', localAuth.stopSession);
crTask.addEventListener('click', createTask);