import Loader from '../components/loader.js';

const loader = new Loader();


export const elementAppearance = (parentContainer, element, step) => {
    if (element) {
        const stepBody = step;
        parentContainer.insertAdjacentElement('beforeend', element);
        const interval = setInterval(() => {
            if (+element.style.opacity >= 1) {
                clearInterval(interval);
                element.focus()
            }
            element.style.opacity = +element.style.opacity + stepBody;
        }, 0.1)
        loader.stopLoader();
    }
}


export const elementDisappearing = (element, step) => {
    if (element) {
        const stepBody = step;
        const intr = setInterval(() => {
            if (+element.style.opacity <= 0) {
                clearInterval(intr);
                element.remove();
            }
            element.style.opacity = +element.style.opacity - stepBody;
        }, 0.01)
    }
}