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


router.post('/set', async(req, res) => {
  try {
    const { themeId } = req.body
    res.json({ message: themeId ? await updateTheme(req.body) : await setTheme(req.body) })
  } catch (e) {
    res.status(500).json({ message: "Server Error: Create theme ended with error" })
  }
})


const updateTheme = async({ themeId, userId }) => {
  const themesById = await Theme.findById(themeId);

  if (!themesById.executor.includes(userId)) {

    themesById.executor.push(userId)
    await Theme.findByIdAndUpdate(themeId, { executor: themesById.executor })
  }

  return 'Theme has been setted'
}

const setTheme = async({ userId, themeName }) => {
  if (await Theme.exists({ theme: themeName })) {
    const theme = await Theme.findOne({ theme: themeName })
    updateTheme({ themeId: theme._id, userId })
  } else {
    const theme = new Theme({ theme: themeName, executor: userId })
    await theme.save()
  }

  return 'Theme has been setted'
}

module.exports = router;