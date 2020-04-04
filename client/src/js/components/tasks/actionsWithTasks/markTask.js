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
      return 'colorActive'
    case 'Приостановлена':
      return 'colorPaused'
    case 'Закрыта':
      return 'colorClose'
    default:
      break;
  }
}