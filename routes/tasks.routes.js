const { Router } = require('express');
const path = require('path');
const Task = require('../models/Task');

const router = Router();


//получени всех задач для страницы root
router.get('/', async(req, res) => {
    try {
        const tasks = await Task.find({});
        // console.log('Задачи:', tasks)
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

//получить задачи по id для админа 
router.post('/admin', async(req, res) => {
    try {
        // console.log(req.body);
        const tasks = await Task.find({ to: req.body.id });
        // console.log('Задачи:', tasks)
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

//получить задачи по id для пользователя
router.post('/user', async(req, res) => {
    try {
        // console.log(req.body);
        const tasks = await Task.find({ from: req.body.id });
        // console.log('Задачи:', tasks)
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});



//обновление статуса задачи 
router.post('/:id', async(req, res) => {
    console.log('Date now: ', new Date())
    try {

        const currentTask = await Task.findById(req.params.id)
        console.log('currentStatus: ', currentTask.status)

        const newStatus = stringToLowerCase(req.body.status)
        switch (newStatus) {
            case 'закрыта':
                if (currentTask.status === newStatus) return
                await Task.findOneAndUpdate({ _id: req.params.id }, { status: newStatus, closeDate: Date.now() })
                return res.json({ message: 'Status has been change...' })

            case 'приостановлена':
                if (currentTask.status === newStatus) return
                await Task.findOneAndUpdate({ _id: req.params.id }, { status: newStatus, pauseDate: Date.now() })
                return res.json({ message: 'Status has been change...' })

            default:
                await Task.findOneAndUpdate({ _id: req.params.id }, { status: newStatus }, )
                return res.json({ message: 'Status has been change...' })
        }

    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

const stringToLowerCase = str => str.trim().toLowerCase()

module.exports = router;