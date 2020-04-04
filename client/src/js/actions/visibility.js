import Loader from "../components/loader/loader.js";

const loader = new Loader();

export const elementAppearance = (parentContainer, element, step) => {
    if (element) {
        const stepBody = step;
        if ([...parentContainer.children].filter(e => e.classList.contains(element.className)).length === 0) {
            parentContainer.insertAdjacentElement('afterbegin', element);
        }
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