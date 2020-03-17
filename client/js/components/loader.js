export default class Loader {
    startLoader(elem) {
        if (elem.querySelector('.loader')) {
            return;
        }
        const loader = createLoader()
        elem.insertAdjacentElement('beforeend', loader);
        loader.style.left = Math.round(elem.clientWidth / 2 - loader.offsetWidth / 2) + 'px';
        loader.style.top = Math.round(elem.clientHeight / 2 - loader.offsetHeight / 2) + 'px';
        positionLoader(elem, loader);
    }

    stopLoader() {
        const loader = document.querySelector('.loader')
        if (loader) loader.remove();
    }
}

const positionLoader = (elem, loader) => {
    window.addEventListener('resize', () => {
        if (elem) {
            loader.style.left = Math.round(elem.clientWidth / 2 - loader.offsetWidth / 2) + 'px';
            loader.style.top = Math.round(elem.clientHeight / 2 - loader.offsetHeight / 2) + 'px';
        }
    })
}

const createLoader = () => {
    const loader = document.createElement('div')
    loader.classList.add('loader');
    loader.style.cssText = `
      position: absolute;
      z-index: 14;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      border: 5px solid transparent;
      border-radius: 50%;
      border-top: 5px solid rgb(255, 0, 0);
      border-bottom: 5px solid rgb(255, 0, 0);
      border-right: 5px solid rgb(255, 0, 0);
      animation: loader 1s linear infinite; `
    return loader
}