const { Router } = require('express');
const path = require('path');


const router = Router();

router.get('/', async(req, res) => {
  res.sendFile(path.join(process.cwd(), 'client', 'dist', 'index.html'));
});

module.exports = router;