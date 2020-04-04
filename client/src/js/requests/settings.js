import { PORT, ADDRESS } from "./requestConfig";

export default class Settings {

  async getAdmins() {
    //1) get all admin user from mongodb
    try {
      const dataAdmUser = await fetch(`http${ADDRESS}${PORT}/opt/user/admin`);
      const resultAdmUser = await dataAdmUser.json();
      return resultAdmUser;
    } catch (e) {}
  }

  async getUsers() {
    //2) get all user with user role from mongodb
    try {
      const dataUser = await fetch(`http${ADDRESS}${PORT}/opt/user`);
      const resultUser = await dataUser.json();
      return resultUser;
    } catch (e) {}
  }

  async getUserById(userId) {
    try {
      const dataUser = await fetch(`http${ADDRESS}${PORT}/opt/user/${userId}`)
      return await dataUser.json();
      // return user;
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
      const resultRoles = await dataRoles.json();
      return resultRoles;

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
      const resultUsers = await dataUsers.json();
      return resultUsers;

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
      const resultThemes = await dataThemes.json();
      return resultThemes;
    } catch (e) {}
  }
}