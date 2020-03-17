import '../styles/index.css';
import LocalAuth from './checking/checkAuth.js'
import Toasts from './components/toasts.js'
import { ADDRESS, PORT } from './requests/requestConfig';

const localAuth = new LocalAuth();
const toast = new Toasts();

localAuth.checkAuth(window.location.pathname);

const logBtn = document.getElementById('loginBtn');
const regBtn = document.getElementById('regBtn');


logBtn.addEventListener('click', async event => {
    try {
        console.log(`http${ADDRESS}${PORT}/shd/auth/login`)
        event.preventDefault();
        const authFrm = document.getElementById('authFrm');
        const obj = {};
        const formData = new FormData(authFrm);
        formData.forEach((value, key) => obj[key] = value);
        const data = await fetch(
            `http${ADDRESS}${PORT}/shd/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-type": 'application/json'
                },
                body: JSON.stringify(obj)
            });
        const result = await data.json();
        // console.dir(result);
        if (!result.ok) {
            toast.createToastContainer(result.message)
        } else {
            const localStr = new LocalAuth(result.userId, result.jwtToken);
            localStr.regAuth();
            window.location.replace(`http${ADDRESS}${PORT}/static/${result.userR}`);
        }
    } catch (e) {}
});


regBtn.addEventListener('click', async event => {
    try {
        event.preventDefault();
        const authFrm = document.getElementById('authFrm');
        const obj = {};
        const formData = new FormData(authFrm);
        formData.forEach((value, key) => obj[key] = value);
        const data = await fetch(
            `http${ADDRESS}${PORT}/shd/auth/register`, {
                method: 'POST',
                headers: {
                    "Content-type": 'application/json'
                },
                body: JSON.stringify(obj)
            });
        const result = await data.json();
        toast.createToastContainer(result.message);
    } catch (e) {}

});