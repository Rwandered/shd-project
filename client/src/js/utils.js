import Loader from "./components/loader/loader";
import Task from "./requests/tasks";
import Table from "./components/table/table";
import {createNoElementContainer} from "./components/tasks/emptyTaskField";
import {elementAppearance} from "./actions/visibility";
import {getUserId} from "./checking/checkAuth";

const loader = new Loader();
const task = new Task();
const table = new Table();

const tableField = document.getElementById('main-part');

export const getTasks = async () => {
  loader.startLoader(tableField);
  const result = await task.getTaskForRole(getUserId());
  const formElement = result.userTasks.length === 0 ?
    createNoElementContainer(tableField, result.userRole) :
    await table.renderTable(result.userTasks);

  elementAppearance(tableField, formElement, 1 / 300);
}