import Settings from '../requests/settings';
import { setCache, getCache, checkCache, getCaches } from './cache.js';

const settings = new Settings();

export const getUserName = async id => {
    console.log(checkCache(id))
    if (checkCache(id)) {
        return getCache(id)
    } else {
        const user = await settings.getUserById(id)
        setCache(id, user)
        return user
    }
}

export const getThemeName = async id => {
    console.log(checkCache(id))
    if (checkCache(id)) {
        return getCache(id)
    } else {
        const theme = await settings.getThemeById(id)
        setCache(id, theme)
        return theme
    }
}