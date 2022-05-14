const express = require('express');

const authController = require('../controller/auth');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth, authController.homePage);

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.logout);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

module.exports = router;
