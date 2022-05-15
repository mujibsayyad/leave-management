const express = require('express');

const adminController = require('../controller/admin');
const { isAuth, authRole } = require('../middleware/isAuth');
const ROLE = require('../middleware/roles');

const router = express.Router();

router.get('/admin', isAuth, authRole(ROLE.ADMIN), adminController.adminPage);

module.exports = router;
