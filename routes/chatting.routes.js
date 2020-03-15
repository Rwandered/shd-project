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

        switch (event) {
            case 'getMessage':
                // отправить результат клиенту, кто запросил
                const allMessageForWs = await getAllMessagesForChat(data);
                ws.send(JSON.stringify(allMessageForWs))
                break;
            case 'setMessage':
                // отправить сообщения кому нужно
                // и записать в базу
                writeNewMessageToChat(data)
                break;
        }
    });
})

//создание колекции чата по новой задаче
async function createNewChatting(data) {
    try {
        const chatMess = {
            task: data.taskId,
            messages: [{
                howSender: data.fromUserId,
                howRecipient: data.toUserId,
                messageBody: data.messageBody
            }],
        }
        const message = new Chatting(chatMess)
        await message.save();
    } catch (e) { e => console.log(e) }
}

//создание нового сообщения для задачи по ее id
async function writeNewMessageToChat(data) {
    try {

        const chatting = await Chatting.findOne({ task: data });
        // console.log(chatting.messages)
        const newMessage = {
            howSender: data.fromUserId,
            howRecipient: data.toUserId,
            messageBody: data.messageBody
        }
        chatting.messages.push(newMessage)
        await Chatting.findOneAndUpdate({ task: data }, { messages: chatting.messages })

    } catch (e) { e => console.log(e) }
}

//получение всех сообщений для задачи по ее id
async function getAllMessagesForChat(data) {
    try {
        // console.log(data)
        const chatting = await Chatting.findOne({ task: data.taskId });
        console.log(chatting)
        return chatting ? chatting.messages : 'No data';

    } catch (e) { e => console.log(e) }
}




module.exports = router;