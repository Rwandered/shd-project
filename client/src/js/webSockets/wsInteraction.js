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

export const sendMessage = messageToWs => {
    if (socket.readyState === WebSocket.OPEN) {
        const wsData = {
            event: 'setMessage',
            data: messageToWs
        }
        socket.send(JSON.stringify(wsData))
    }
}

export const newTaskToWs = task => {
    // console.log(task)
    if (socket.readyState === WebSocket.OPEN) {
        const wsData = {
            event: 'newTask',
            data: task
        }
        socket.send(JSON.stringify(wsData))
        return task
    }
}

export const newTaskStatusToWs = data => {
    // console.log(data)
    if (socket.readyState === WebSocket.OPEN) {
        const wsData = {
            event: 'newTaskStatus',
            data
        }
        socket.send(JSON.stringify(wsData))
    }
}