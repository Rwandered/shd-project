const { Router } = require('express');
const User = require('../models/User');

const router = Router();


//получение пользователя по id для сравнения c id который храниться в localstorage если не очищен jwt
router.get('/:id', async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user.role);
    res.json(user.role);

  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;