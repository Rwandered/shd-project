import Settings from "./settings.js";
import { ADDRESS, PORT } from "./requestConfig.js";


const settings = new Settings();

export default class Task {

  //1) получить задачи
  async getAllTask() {
    try {
      const tasks = await fetch(`http${ADDRESS}${PORT}/opt/tasks`);
      const result = await tasks.json();
      return result;
    } catch (e) {}
  }

  async createTask(data) {
    // console.log(data)
    try {
      const tasks = await fetch(`http${ADDRESS}${PORT}/shd/create/task`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await tasks.json();
      return result;
    } catch (e) {}
  }

  deleteTask() {

  }

  async getTaskForRole(id) { // приходит id текущего пользователя
    try {
      //1) получить по id  пользователя
      const user = await settings.getUserById(id);
      // console.log(user.role);
      const tasks = await fetch(
        `http${ADDRESS}${PORT}/opt/tasks/${user.role}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ id })
        }
      );
      const result = await tasks.json();
      return { userRole: user.role, userTasks: result }
    } catch (e) {}
  }


  async updateTaskStatus(id, status) {
    try {
      const dataTask = await fetch(
        `http${ADDRESS}${PORT}/opt/tasks/${id}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );
      const resultTask = await dataTask.json();
      return resultTask;
    } catch (e) {}
  }
}