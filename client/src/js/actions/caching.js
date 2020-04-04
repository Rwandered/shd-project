import Settings from '../requests/settings.js';
import { setCache, getCache, checkCache } from './cache.js';

const settings = new Settings();

export const getUserName = async id => checkCache(id) ? getCache(id) : await createCacheData(id, 'user')
export const getThemeName = async id => checkCache(id) ? getCache(id) : await createCacheData(id, 'theme')


const createCacheData = async(id, type) => {
  let data;
  switch (type) {
    case 'user':
      data = await settings.getUserById(id)
      setCache(id, data)
      break;
    case 'theme':
      data = await settings.getThemeById(id)
      setCache(id, data)
      break
  }
  return data;
}