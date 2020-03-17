const cache = {}
export const setCache = (id, data) => cache[id] = data;
export const getCache = (id) => {
    console.log('Cache')
    return cache[id]
}
export const getCaches = () => cache;
export const checkCache = (id) => id in cache