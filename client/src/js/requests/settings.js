import {ADDRESS, PORT} from "./requestConfig";

export default class Settings {

  async getAdmins() {
    //1) get all admin user from mongodb
    try {
      const dataAdmUser = await fetch(`http${ADDRESS}${PORT}/opt/user/admin`);
      return await dataAdmUser.json();

    } catch (e) {}
  }

  async getUsers() {
    //2) get all user with user role from mongodb
    try {
      const dataUser = await fetch(`http${ADDRESS}${PORT}/opt/user`);
      return await dataUser.json();

    } catch (e) {}
  }

  async getUserById(userId) {
    try {
      const dataUser = await fetch(`http${ADDRESS}${PORT}/opt/user/${userId}`)
      return await dataUser.json();

    } catch (e) {}
  }

  async getAllTheme() {
    try {
      const themes = await fetch(`http${ADDRESS}${PORT}/opt/theme`);
      return await themes.json();
    } catch (e) {}
  }



  async getThemeById(themeId) {
    try {
      const dataTheme = await fetch(`http${ADDRESS}${PORT}/opt/theme/${themeId}`);
      return await dataTheme.json();
    } catch (e) {}
  }


  async setRole(data) {
    try {
      const dataRoles = await fetch(
        `http${ADDRESS}${PORT}/shd/create/role`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      return await dataRoles.json();

    } catch (e) {}
  }


  async setUser(data) {
    try {
      const dataUsers = await fetch(
        `http${ADDRESS}${PORT}/shd/auth/register`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      return await dataUsers.json();

    } catch (e) {}
  }


  async setTheme(data) {
    try {
      const dataThemes = await fetch(
        `http${ADDRESS}${PORT}/opt/theme/set`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      return await dataThemes.json();
    } catch (e) {}
  }
}