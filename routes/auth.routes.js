const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtToken = require('jsonwebtoken');
const config = require('config');


const router = Router();
//сюда приходит запрос с префиксом /shd/auth/register
router.post(
    '/register', [
        check('email', 'Неверный email').isEmail(),
        check('password', 'Неверный пароль').isLength({ min: 6 })
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array,
                    message: 'Ошибка соединения - Указаны некорректные данные'
                });
            }
            const { name, email, password } = req.body;
            // тут надо проверить есть ли уже такой пользоватлеь в бд
            const usrCondidate = await User.findOne({ email });
            if (usrCondidate) {
                return res.status(400).json({ message: 'User already exists' });
            }
            //поулчили хеш пароля
            const pwdHash = await bcrypt.hash(password, 12);
            // console.log(pwdHash);
            //create User
            const user = new User({ name, email, password: pwdHash, role: 'user' });
            //добавляем пользователя в базу
            user.save();
            res.status(201).json({ message: 'User has been created...' });
            // если данные удовлтворяют требованиям то записываем в базу
        } catch (e) {
            res.status(500).json({ message: 'Server errors', ok: false });
        }
    }
);

// // /shd/auth/login
router.post(
    '/login', [
        check('email', 'ввдедите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
        // check('password', 'Введите пароль').isLength({ min: 6 })
    ],
    async(req, res) => {
        try {
            //прежде чем начать работать с полученными данными надо их провалидировать
            //для этого неолбходиом установить модуль npm i express-validator
            // для этого в метод post routera добавили параметр - массив валидаторов 
            // теперь можно делать логику валидации
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array,
                    message: 'Ошибка соединения - Указаны некорректные данные'
                });
            }
            //здесь я буду соединяться с базой
            const { email, password } = req.body;

            const user = await User.findOne({ email }); //пробуем получить из базы пользователя

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден', ok: false });
            }

            //теперь мне надо сравнить пароли пользователя из бд и тот что пришел на сервер
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Пароль неверный', ok: false });
            }
            // console.log(user.role);
            // теперь если пароли ок то я выдам jwt token, отправим его фронтенду, плюc отправим id user и role user
            // формируем jwt token для этого установить пакет npm i jsonwebtoken
            const token = jwtToken.sign({ userId: user.id }, // user id
                config.get('jwtSecret'), // секретная фраза
                { expiresIn: '1h' } //срок на который выдается токен
            );

            // console.log(token);
            res.json({
                userR: user.role,
                userId: user.id,
                jwtToken: token,
                ok: true
            });
        } catch (e) {
            res.status(500).json({ message: 'Server Errors', ok: false });
        }
    }
);



module.exports = router;