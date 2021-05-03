const express = require('express');
const viewsController = require('../controllers/viewsController');
// const authController = require('../controllers/authController');

const router = express.Router();
//router.use(authController.isLoggedIn);

// router.get('/', authController.isLoggedIn, viewsController.getLogin);
router.get('/index', viewsController.getIndex);
router.get('/logs', viewsController.getLogs);

router.get('*', viewsController.get404);

module.exports = router;