const { Router } = require('express');
const path = require('path');
const Theme = require('../models/Theme');


const router = Router();

//получить все темы при формировании блока с созданием задачи

router.get('/', async(req, res) => {
    try {
        const themes = await Theme.find({});
        res.json(themes);

    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});


//получить темы по id
router.get('/:id', async(req, res) => {
    try {
        const themes = await Theme.findById(req.params.id);
        // console.log('Theme:', themes);
        res.json(themes);
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});



//добавление исполнителей темы по id темы
router.post('/update', async(req, res) => {
    try {

        const { themeId, userId } = req.body;
        const themesById = await Theme.findById(themeId);
        themesById.executor.push(userId)
            // console.log(themesById.executor)
        const theme = await Theme.findByIdAndUpdate(themeId, { executor: themesById.executor })
            // const themes = await Theme.findById(req.params.id);
            // console.log('Theme:', themes);
            // res.json(themes);
        res.json({ message: 'Theme has been updated...' });
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});




module.exports = router;