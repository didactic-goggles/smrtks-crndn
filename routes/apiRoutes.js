const express = require('express');
const viewsController = require('../controllers/viewsController');
const apiController = require('../controllers/apiController');
// const authController = require('../controllers/authController');

const router = express.Router();
//router.use(authController.isLoggedIn);

// begin:: API
router.get('/logs', apiController.getLogs);

router.get('/permissions', apiController.getPermissions);

// end:: API
router.get('*', viewsController.get404);

module.exports = router;