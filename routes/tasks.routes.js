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

//получить зачади по id для админа 
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

//получить зачади по id для пользователя
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
    try {
        const tasks = await Task.findOneAndUpdate({ _id: req.params.id }, { status: req.body.status })
        res.json({ message: 'Status has been change...' })
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;