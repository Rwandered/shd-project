import { updateColorTask } from "./markTask";
import Toasts from "../../toasts/toasts";

export const displayNewStatusTask = wsAnswer => {
    const tableBodies = document.querySelectorAll('.tableBody')
    const [tableBody] = [...tableBodies].filter(tableBody => JSON.parse(tableBody.dataset.taskContent).taskId === wsAnswer.taskId)
    const statusField = tableBody.querySelector('.status');
    statusField.textContent = wsAnswer.data;
    updateColorTask(statusField);
    new Toasts().createToastContainer('Был изменен статус задачи...')
    const tableFirstTd = tableBody.querySelector('.id')
    const intr = setInterval(() => {
        tableFirstTd.classList.toggle('new-status')
        setTimeout(() => {
            tableFirstTd.classList.toggle('new-status')
        }, 500)
    }, 1000)
    setTimeout(() => clearInterval(intr), 4000)
}