import { socket } from "./connectionWs.js";

export const getMessage = dataForChat => {
    const taskId = JSON.parse(dataForChat.dataset.taskContent).taskId
    if (socket.readyState === WebSocket.OPEN) {
        const wsData = {
            event: 'getMessage',
            data: { taskId }
        }
        socket.send(JSON.stringify(wsData))
    }
}

export const sendMessage = dataForChat => {
    const dataToWs = JSON.parse(dataForChat.dataset.taskContent)
    if (socket.readyState === WebSocket.OPEN) {
        const wsData = {
            event: 'setMessage',
            data: {
                taskId: dataToWs.taskId,
                fromUserId: dataToWs.fromUserId,
                toUserId: dataToWs.toUserId,
                messageBody: 'Why my task in work yet?'
            }
        }
        socket.send(JSON.stringify(wsData))
    }
}