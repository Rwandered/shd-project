const { Router } = require('express');
const path = require('path');


const router = Router();

router.get('/root', async(req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'dist', 'root.html'));
});

router.get('/user', async(req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'dist', 'user.html'));
});

router.get('/admin', async(req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'dist', 'admin.html'));
});

module.exports = router;