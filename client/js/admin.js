import '../styles/admin.css';
import '../styles/reset.css';
import '../styles/common.css';
import Loader from './components/loader.js';
import Task from './requests/tasks.js';
import Table from './components/table.js'
import LocalAuth, { getUserId } from './checking/checkAuth.js';
import { createNoElementContainer } from './components/noElement.js'
import { elementAppearance } from './actions/visibility.js';
import { repeatingUpdate } from './actions/updateRender.js';



const loader = new Loader();

const task = new Task();
const table = new Table();
const localAuth = new LocalAuth();


// const location = window.location.pathname;
localAuth.checkAuth(window.location.pathname);


const tableField = document.getElementById('main-part');
const exitBtn = document.getElementById('exit');

const getTasks = async() => {
    loader.startLoader(tableField);
    const result = await task.getTaskForRole(getUserId());
    const formElement = result.userTasks.length == 0 ?
        createNoElementContainer(tableField, result.userRole) :
        await table.renderTable(result.userTasks);

    elementAppearance(tableField, formElement, 1 / 300);
}


const repeatingUpdateTask = () => repeatingUpdate(getTasks);

document.addEventListener('DOMContentLoaded', getTasks);
exitBtn.addEventListener('click', localAuth.stopSession);

repeatingUpdateTask();