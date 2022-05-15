const express = require('express');

const userController = require('../controller/user');
const { isAuth } = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth, userController.homePage);

router.get('/profile', isAuth, userController.profile);

router.get('/leave', isAuth, userController.form);

module.exports = router;
