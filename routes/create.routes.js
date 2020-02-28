const { Router } = require('express');
const path = require('path');
const User = require('../models/User');
const Theme = require('../models/Theme');
const Task = require('../models/Task');


const router = Router();

// /create/role - создание коллеции => где за пользователем закрепляется роль
router.post('/role', async(req, res) => {
    try {
        const { userId, role } = req.body;
        // console.log(userId, role);
        const user = await User.findOneAndUpdate({ _id: userId }, { role });
        res.json({ message: 'Role has been update...' });
    } catch (e) {
        res.status(500).json({ message: 'Server errors' });
    }
});

// /create/theme - создание коллеции => где за пользователем закрепляется тема задачи? создание темы и прикрепление пользователя
router.post('/theme', async(req, res) => {
    try {

        const { themeName, userId } = req.body;

        const theme = new Theme({
            theme: themeName,
            executor: userId
        });
        await theme.save();
        res.json({ message: 'Theme has been created...' });

    } catch (e) {
        res.status(500).json({ message: 'Server Errors' });
    }
});


// /create/task - создание коллеции => создание задачи
router.post('/task', async(req, res) => {
    try {
        const { theme, from, to, description } = req.body;
        const task = new Task({
            theme,
            from,
            to,
            description
        });
        await task.save();
        res.json({ task, message: 'Task has been created...' });
    } catch (e) {
        res.status(500).json({ Error: e, message: 'Server errors' });
    }
});


module.exports = router;