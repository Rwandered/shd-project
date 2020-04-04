import { elementDisappearing } from "./visibility.js";

export const repeatingUpdate = method => {
    setInterval(() => {
        const table = document.querySelector('.table');
        if (table) {
            elementDisappearing(table, 1000 / 300);
            method();
        } else {
            const oops = document.querySelector('.oops');
            elementDisappearing(oops, 1000 / 300);
            method();
        }
    }, 900000)
}