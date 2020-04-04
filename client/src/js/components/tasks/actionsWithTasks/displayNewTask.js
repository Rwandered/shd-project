import { startChat } from "../../chat/chat";
// import { rePositionChatWrapper } from "../../chat/actionsWithChat/displayChat";
import { elementAppearance, elementDisappearing } from '../../../actions/visibility.js';
import Table, { createEvents } from "../../table/table";
import Toasts from "../../toasts/toasts";

export const displayNewTask = userTask => {
  const table = new Table()
  const tableField = document.getElementById('main-part');
  const tableContainer = tableField.querySelector('.table');

  if (tableContainer) {
    const tableContainerHeader = tableContainer.querySelector('thead')
    table.getTaskData(userTask)
      .then(result => table.getBody(result))
      .then(result => {
        startChat(result);
        createEvents(result);
        tableContainerHeader.insertAdjacentElement('afterend', result);
        new Toasts().createToastContainer('Для вас есть новая задача...')
        const tableFirstTd = result.querySelector('.id')

        const intr = setInterval(() => {
          tableFirstTd.classList.toggle('new-task')
          setTimeout(() => {
            tableFirstTd.classList.toggle('new-task')
          }, 500)
        }, 1000)

        setTimeout(() => clearInterval(intr), 4000)
      })
      .catch(e => console.error(e))
  } else {
    table.renderTable([userTask])
      .then(result => {

        const mainWrapper = document.getElementById('main-part')
        const oops = mainWrapper.querySelector('.oops');
        elementDisappearing(oops, 1 / 4);
        elementAppearance(tableField, result, 1 / 300)

        new Toasts().createToastContainer('Для вас есть новая задача...')

        const tableFirstTd = result.querySelector('.id')
        const intr = setInterval(() => {
          tableFirstTd.classList.toggle('new-task')
          setTimeout(() => {
            tableFirstTd.classList.toggle('new-task')
          }, 500)
        }, 1000)
        setTimeout(() => clearInterval(intr), 4000)
      })
      .catch(e => console.error(e));
  }
}