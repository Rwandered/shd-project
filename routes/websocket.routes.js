const { Router } = require('express');
const Chatting = require('../models/Chatting');

const router = Router();

const clients = {}

router.ws('/:id', (ws, req) => {
    clients[req.params.id] = ws;
    // console.log(clients)
    console.log('Connected')
        // ws.send("Connected!");
    console.log(req.params.id)

    ws.on('message', async msg => {
        const { event, data } = JSON.parse(msg);
        // console.log(data)
        switch (event) {
            case 'getMessage':
                // отправить результат клиенту, кто запросил, но результат должен быть не просто  данные от базы нужно туда запихнуть event
                // тут getMessage ниже setMessage
                const allMessageForWs = await getAllMessagesForChat(data);
                // console.log(allMessageForWs)
                const wsAnswer = {
                    event: event,
                    taskId: data.taskId,
                    data: allMessageForWs
                }
                ws.send(JSON.stringify(wsAnswer))
                break;
            case 'setMessage':

                if (data.howRecipient in clients) {
                    const wsAnswer = {
                            event,
                            taskId: data.taskId,
                            data: [data],
                        }
                        // отправили ссобщение на сторону клиента
                    clients[data.howRecipient].send(JSON.stringify(wsAnswer))
                    writeNewMessageToChat(data)
                } else {
                    // если клиента нет в активных то просто запись в базу
                    writeNewMessageToChat(data)
                }
                break;
            case 'newTask':
                if (data.to in clients) {
                    const wsAnswer = {
                            event,
                            data: [data],
                        }
                        // отправили ссобщение на сторону клиента
                    clients[data.to].send(JSON.stringify(wsAnswer))
                }
                break;

            case 'newTaskStatus':
                if (data.howRecipient in clients) {
                    const wsAnswer = {
                        event,
                        taskId: data.taskId,
                        data: data.taskStatus
                    }
                    clients[data.howRecipient].send(JSON.stringify(wsAnswer))
                }
        }
    });
})

//создание колекции чата по новой задаче
async function createNewChatting(data) {
    try {
        const chatMess = {
                task: data.taskId,
                messages: [{
                    howSender: data.howSender,
                    howRecipient: data.howRecipient,
                    messageBody: data.messageBody
                }],
            }
            // console.log(chatMess)
        const message = new Chatting(chatMess)
        await message.save();
    } catch (e) { e => console.log(e) }
}

//создание нового сообщения для задачи по ее id
async function writeNewMessageToChat(data) {
    try {
        const exists = await Chatting.exists({ task: data.taskId });
        if (exists) {
            const chatting = await Chatting.findOne({ task: data.taskId });
            const newMessage = {
                howSender: data.howSender,
                howRecipient: data.howRecipient,
                messageBody: data.messageBody
            }
            chatting.messages.push(newMessage)
            await Chatting.findOneAndUpdate({ task: data.taskId }, { messages: chatting.messages })
        } else {
            createNewChatting(data);
        }
    } catch (e) { e => console.log(e) }
}

//получение всех сообщений для задачи по ее id
async function getAllMessagesForChat(data) {
    try {
        const chatting = await Chatting.findOne({ task: data.taskId });
        return chatting ? chatting.messages : 'No data';
    } catch (e) { e => console.log(e) }
}

module.exports = router;