const { Router } = require('express');
const path = require('path');
const User = require('../models/User');

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


//тут получить всех пользователей с ролью Admin

router.get('/admin', async(req, res) => {
  try {
    // console.log(req.params);
    const admUsers = await User.find({ role: 'admin' });
    // console.log('Путь - получить всех пользователей по роли admin');
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


//получение пользователя по id 

router.get('/:id', async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log(user);
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;