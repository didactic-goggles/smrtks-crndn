const express = require('express');
const viewsController = require('../controllers/viewsController');
const apiController = require('../controllers/apiController');
// const authController = require('../controllers/authController');

const router = express.Router();
//router.use(authController.isLoggedIn);

router.get('/logs', viewsController.getLogs);

router.get('/permissions', viewsController.getPermissions);

router.get('*', viewsController.get404);

module.exports = router;