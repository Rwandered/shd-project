export const startValidation = targetElement => {

    let validStatus = true;

    const selectUsersBtn = targetElement.querySelector('.select-users')
    const selectThemesBtn = targetElement.querySelector('.select-theme')
    if (selectUsersBtn.classList.contains('no-valid')) {
        selectUsersBtn.classList.toggle('no-valid')
    }
    if (selectThemesBtn.classList.contains('no-valid')) {
        selectThemesBtn.classList.toggle('no-valid')
    }

    const validItems = targetElement.querySelectorAll('.valid-item');

    validItems.forEach(item => {
        if (item.classList.contains('no-valid')) {
            item.classList.toggle('no-valid');
        }
        if (item.value == '') {
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
    return validStatus;
};