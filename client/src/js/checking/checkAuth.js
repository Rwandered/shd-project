import Settings from '../requests/settings.js';
import { ADDRESS, PORT } from '../requests/requestConfig.js';
import { setCache, getCache, checkCache } from '../actions/cache.js';


const settings = new Settings();

export default class LocalAuth {
    constructor(userId, token) {
        this.userId = userId;
        this.token = token;
        this.storagename = 'userData';
    }

    checkAuth(location) {
        const userData = localStorage.getItem(this.storagename)
        if (userData) {
            const userAuthData = JSON.parse(userData);

            if (userAuthData.token) {
                if (checkCache(userAuthData.userId)) {
                    const user = getCache(userAuthData.userId);
                    window.location.replace(`http${ADDRESS}${PORT}/static/${user.role}`);
                } else {
                    settings.getUserById(userAuthData.userId)
                        .then(r => {
                            setCache(userAuthData.userId, r)
                            if (!location.includes(r.role)) {
                                window.location.replace(`http${ADDRESS}${PORT}/static/${r.role}`);
                            }
                        })
                }
            }
        } else {
            if (window.location.pathname !== '/') {
                window.location = window.location.origin;
            }
        }
    }

    regAuth() {
        localStorage.setItem(this.storagename, JSON.stringify({
            userId: this.userId,
            token: this.token
        }));
    }

    stopSession() {
        localStorage.clear();
        window.location = window.location.origin;
    }
}

export const getUserId = () => {
    const userData = getCurrentUser();
    if (userData) {
        const userId = userData.userId
        return userId
    }
}

export const getCurrentUser = () => JSON.parse(localStorage.getItem('userData'))