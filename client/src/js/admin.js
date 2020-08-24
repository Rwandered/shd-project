import LocalAuth from './checking/checkAuth.js';
import '../styles/css/reset.css';
import '../styles/css/common.css';
import { getTasks } from "./utils";


const localAuth = new LocalAuth();
localAuth.checkAuth(window.location.pathname);

const exitBtn = document.getElementById('exit');

document.addEventListener('DOMContentLoaded', getTasks);
exitBtn.addEventListener('click', localAuth.stopSession);