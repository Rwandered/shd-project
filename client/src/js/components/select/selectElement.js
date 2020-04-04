export const createSelectField = () => {
  const selectField = document.createElement('div');
  selectField.classList.add('select-wrapper');
  return selectField;
};


export const createList = () => {
  //1 созадем ul и заголовок
  const listWrapper = document.createElement('ul');
  const listHeader = `<li class="lHeader"><span>Выберите элемент :</span></li>`;
  //2 добавляем в ul заголовок
  listWrapper.insertAdjacentHTML('beforeend', listHeader);
  return listWrapper;
};

export const setSelectFieldStyle = (selectWrapper, parentElement) => {
  // parentElement - относительно чего задавать размеры
  // selectWrapper - кому задавать стили
  selectWrapper.tabIndex = '0';
  selectWrapper.style.cssText = `
    box-sizing: border-box;
    width: ${parentElement.offsetWidth}px;
    position: absolute;
    left: ${parentElement.offsetLeft}px;
    top: ${parentElement.offsetTop}px; opacity: 1 `;
};