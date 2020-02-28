const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');


const PORT = config.get('port') || 5000;
const app = express();

app.use(express.json({ extended: true })); //для корректной отправки ответа от сервера

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.use('/static', express.static(path.join(__dirname, 'client', 'dist')));

app.use('/shd/auth', require('./routes/auth.routes')); // сюда пойдут запросы по аутентификации

app.use('/', require('./routes/welcome.routes')); // сюда пойдет стартовый запрос

app.use('/shd/create', require('./routes/create.routes')); // сюда придут запросы связанные с созданием чего-либо (задача, пользвоатель, темы и д. т.)

app.use('/static', require('./routes/page.routes')); //сюда придут запросы для получения страниц по роли доступа

// app.use('/opt', require('./routes/get.routes')); //сюда придут запросы на формирование списокв настроек, например при задание ролей необходимо получить список пользователей
//или при задание соответствии темы задачи, нужно получить список пользователей администраторов

app.use('/opt/user', require('./routes/users.routes'))

app.use('/opt/tasks', require('./routes/tasks.routes'))

app.use('/opt/theme', require('./routes/theme.routes'))



async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false

        });

        app.listen(PORT, () => {
            console.log(`Server has been started on PORT ${PORT}`);
        });

    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();