export const createModalContainer = () => {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modalWindow-wrapper');
    return modalContainer;
};

export const createModalLayer = () => {
    const modalLayer = document.createElement('div');
    modalLayer.classList.add('bg-layer-true');
    document.body.insertAdjacentElement('beforebegin', modalLayer);
    modalLayer.classList.toggle('bg-layer');
    return modalLayer;
};

export const createModalHeader = headerName => {
    const modalHeader = `
        <div id="headerModal">
            <p>${headerName}</p>
            <img src="closeWindow.png" alt="Close">               
        </div> `;
    return modalHeader;
};


export const createModalBtn = headerName => {
    const modalBtn = document.createElement('button');
    modalBtn.textContent = headerName;
    modalBtn.style.float = 'left';
    modalBtn.style.width = '150px';
    return modalBtn;
};


export const setCommonEvents = (element, substrate) => {
    element.addEventListener('click', () => {
        if (event.target.tagName == 'IMG') {
            closeWindow(element, substrate);
        }
    });
    window.addEventListener('resize', setCommonPosition);
}


export const setCommonPosition = () => {
    // 1) получим модальное окно
    const modalWindowWrapper = document.querySelector('.modalWindow-wrapper');
    //2) если модальное окно существует
    if (modalWindowWrapper) {
        //3) позиционируем по центру модальное окно
        modalWindowWrapper.style.left = Math.round(document.documentElement.clientWidth / 2 - modalWindowWrapper.offsetWidth / 2) + 'px';
        modalWindowWrapper.style.top = Math.round(modalWindowWrapper.offsetHeight / 2) + 'px';
    }
}

export const closeWindow = (element, substrate) => {
    element.remove();
    substrate.remove();
};