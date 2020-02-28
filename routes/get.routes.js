const { Router } = require('express');
const User = require('../models/User');
const Theme = require('../models/Theme');
const Task = require('../models/Task');

const router = Router();

//тут получить всех пользователей с ролью user
router.get('/', async(req, res) => {
    try {

        const users = await User.find({ role: 'user' });

        // console.log(users); //users -  это массив объектов пользователей, можно вернуть его,
        // но по идее нам нужно только id и email то есть немного переделать запрос
        res.json({
            users: users.map(user => {
                return { id: user.id, email: user.email }
            })
        });
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

//тут получить всех пользователей по роли

router.get('/role/admin', async(req, res) => {
    try {
        // console.log(req.params);
        const admUsers = await User.find({ role: 'admin' });
        // console.log('Путь - получить всех пользователей по роли');
        res.json({
            users: admUsers.map(user => {
                return { id: user.id, email: user.email }
            })
        });
        // console.log(req.params.role)

    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

//получить все темы при формировании блока с созданием задачи

router.get('/theme', async(req, res) => {
    try {
        const themes = await Theme.find({});
        // console.log('Theme');
        res.json(themes);

    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

//получение задач для текущего пользователя по его id для формирование таблицы

// router.get('/task:id:role', async(req, res) => {
//     try {

//         if (req.params.role === 'admin') {
//             const tasks = await Task.find({ to: req.params.id });
//             return res.json(tasks);
//         }

//         const tasks = await Task.find({ from: req.params.id });
//         res.json(tasks);

//     } catch (e) {
//         res.status(500).json({ message: "Server Error" });
//     }
// });

//получение пользователя по id для сравнения c id который храниться в localstorage если не очищен jwt

router.get('/user:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // console.log('User jwt');
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});


//получени всех задач для страницы root
router.get('/tasks', async(req, res) => {
    try {

        const tasks = await Task.find({});
        // console.log('Задачи')
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;