import { transformChatFadeOut, transformTableToRight, transformChatFadeInFromLeft, transformChatFadeInFromRight, transformTableFromLeft } from "../actions/transform.js";

export const startChat = () => {
    //1 проверка существует ли уже поле чата
    const chatWrapper = document.querySelector('.chat-wrapper')
    chatWrapper ?
        console.log('Обертка чата существует... нужно ее изменить и добавить поле ', chatWrapper) :
        createChatWindow();
}

export function createChatWindow() {
    const mainPart = document.getElementById('main-part')

    //1 create chat wrapper
    const chatWrapper = createChatWrapper();
    //2 create chat header
    const chatHeader = createChatHeader()
        //3 create chat message
    const chatMessage = createChatMessage();
    //4 create chat footer
    const chatFooter = createChatFooter();
    //5 add all components to chat wrapper
    chatWrapper.insertAdjacentElement('afterbegin', chatHeader);
    chatWrapper.insertAdjacentElement('beforeend', chatMessage);
    chatWrapper.insertAdjacentElement('beforeend', chatFooter);
    //6 add chat wrapper to main part
    mainPart.insertAdjacentElement('afterbegin', chatWrapper);
    //8 задаем изначальное позиционирование в зависимости от размера окна
    setCustomPosition(chatWrapper);
    //7 задаем пользовательские стили - то есть стили для подвала
    setCustomStyles(chatWrapper);
    //8 задаем размеры и позиционирование для ресайзе основного окна
    // window.addEventListener('resize', () => { resizePosition(chatWrapper) });

    return chatWrapper;
}


function createChatWrapper() {
    const chatWrapper = document.createElement('div');
    chatWrapper.classList.add('chat-wrapper')
    return chatWrapper;
}


function createChatHeader() {
    //1 создали еделмент шапки для чата
    const chatHeader = document.createElement('div')
        //2 добавили класс
    chatHeader.classList.add('chat-header')
        //3 долбавили контент шапки
    const chatHeaderContent = `
        <p class="task-theme">Task theme</p>
        <img class="to-back rotate" src="closeWindow.png" alt="Назад">`;
    //4 добавили в шапку контент    
    chatHeader.insertAdjacentHTML('afterbegin', chatHeaderContent);
    //5 навесили события на шапку
    chatHeader.addEventListener('click', () => { setChatHeaderEvents(event.target) });
    return chatHeader;
}


const setChatHeaderEvents = chatHeaderItem => {
    if (chatHeaderItem.classList.contains('to-back')) {
        //при клике на кнопку закрыть  - форма чата уходит вправо таблица выходит слева
        transformChatFadeOut();
        transformTableFromLeft();
    }
}


function createChatMessage() {
    const chatMessage = document.createElement('div')
    chatMessage.classList.add('chat-message')
    return chatMessage;
}

function createChatFooter() {
    const chatFooter = document.createElement('div')
    chatFooter.classList.add('chat-footer')

    const chatFooterContent = `
        <textarea name="message" class="chat-field-text-to-send"></textarea>
        <div class="chat-btn">
            <img class="attached" src="attached.png" alt="">
            <img class="send" src="send-mess.png" alt="">
        </div>
        `
    chatFooter.insertAdjacentHTML('afterbegin', chatFooterContent)
    return chatFooter;
}


const setCustomStyles = chatWrapper => {
    //в этом методе задаются стили для позиционирования элементов внутри chatField
    const chatFooter = chatWrapper.querySelector('.chat-footer');
    const txtField = chatFooter.querySelector('.chat-field-text-to-send')
    const btnContainer = chatFooter.querySelector('.chat-btn')

    btnContainer.style.top = btnContainer.offsetHeight / 4 + 'px';
    txtField.style.width = `${chatFooter.offsetWidth - btnContainer.offsetWidth - 15}px`;

}


const setCustomPosition = chatWrapper => {
    const mainPart = document.getElementById('main-part');
    mainPart.style.overflow = 'hidden';

    //1 получаем основное окно
    const docWrapper = document.documentElement;
    //2 получаем родительский элемент
    const parentElement = chatWrapper.closest('#main-part');
    //3 задаем высоту окна чата относительно main part
    chatWrapper.style.height = Math.round(parentElement.offsetHeight - 100) + 'px';
    //4 далее в зависимости от размера основного окна позиционируем окно чата
    if (docWrapper.offsetWidth <= 1650) {
        //раз основное окно меньше чем размер таблицы и поле чата вместе
        //то поле чата должно появляться слева, а таблица уезжать вправо
        //4.1 обтекаем окно часто слева
        chatWrapper.style.float = 'left';
        //4.2 показываем окно чата слева направо
        transformChatFadeInFromLeft();
        // //4.3 задаме размер окна чата в зависимости от основного окна если уж совсем маленькое окно
        if (docWrapper.offsetWidth < 600) {
            chatWrapper.style.width = Math.round(parentElement.clientWidth) + 'px';
            // chatWrapper.style.width = '270px'
            console.log(chatWrapper.offsetWidth)
        }
        //4.4 задаем позиционирование окна по центру текущей области

        chatWrapper.style.left = Math.round(parentElement.clientWidth / 2 - chatWrapper.offsetWidth / 2) + 'px';
        //4.5 таблица уезжает право
        transformTableToRight();
        mainPart.style.overflow = ''

    } else {
        //если размер нормальный то просто 
        transformChatFadeInFromRight();

    }
}

const resizePosition = chatWrapper => {

    const table = document.querySelector('.table')
    console.log(table.offsetWidth)
    if (document.documentElement.offsetWidth < 1650) {
        chatWrapper.style.display = 'none'
    } else {
        chatWrapper.style.display = ''
    }
}

// при клике на кнопку начала чата создается контейнер чата
// и если еще еще ни разу не создавали он (контейнер) выезжает в пустойе место српава при полном экране
// то есть ему задаются стили изначально далеко за пределами жкрана с позиционированием через трансформ
// а его реальное положение рядом с таблицей вот он и выезжает на свое реальное положение 
// если уже создали окно чата и кликаем по кнопке начать чат с другим пользователем, 
// то текущее окно просто плавно исчезает и на его место 
// появлеться новое окно чата просто уходит в display none
// кнопка убрать будет доступна только в мобильной версии

// если мобильная версия 
// то таблица и контейнер чата будут меняться местами, а именно
// таблица уходит вправо, а чат вылазит слева (если чата нет то он создается потом вылазит) - то
// есть также задаем ему начальное позиционирование
// там где начинается таблица, задаем его размер и трансформом смещает за пределы экрана,
// потом он выезжает туду куда нужно, нажав кнопку на поле чата убрать все возвращается обратно


//если размер экрана меньше чем 1650px скрывает чат если он создан
//