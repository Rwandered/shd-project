export const startValidation = targetElement => {
    // данный метод должен принимать элемент в котором будет происходить валидация в нашем варианте это все форма
    let validStatus = true;

    //1) получим элементы модального окна для порлучения выпадающего списка
    const selectUsersBtn = targetElement.querySelector('.select-users')
    const selectThemesBtn = targetElement.querySelector('.select-theme')
    if (selectUsersBtn.classList.contains('no-valid')) {
        selectUsersBtn.classList.toggle('no-valid')
    }
    if (selectThemesBtn.classList.contains('no-valid')) {
        selectThemesBtn.classList.toggle('no-valid')
    }
    //2) проверить поля на пустоту
    const validItems = targetElement.querySelectorAll('.valid-item');

    validItems.forEach(item => {
        if (item.classList.contains('no-valid')) {
            item.classList.toggle('no-valid');
        }
        if (item.value == '') {
            // //2) проверить селектор
            switch (item.id) {
                case 'themeId':
                    selectThemesBtn.classList.toggle('no-valid')
                    break;

                case 'toId':
                    selectUsersBtn.classList.toggle('no-valid')
                    break;

                default:
                    item.classList.toggle('no-valid')
                    break;
            }
            validStatus = false;
        }
    });

    // console.log(validStatus)
    return validStatus;
};