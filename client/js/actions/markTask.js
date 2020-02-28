export function updateColorTask(element) {
    // element - то что закрашиваем куда вешаем класс
    const task = element.closest('.tableBody');
    task.className = 'tableBody';
    task.classList.add(`${switchStatusColor(element.textContent)}`)
}

export function setColorTask(status) {
    return switchStatusColor(status)
}

function switchStatusColor(status) {
    switch (status) {
        case 'Активная':
            return 'colorGreen'
        case 'Приостановлена':
            return 'colorBlue'
        case 'Закрыта':
            return 'colorGray'
        default:
            break;
    }
}