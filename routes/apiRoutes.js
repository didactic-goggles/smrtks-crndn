const express = require('express');
const viewsController = require('../controllers/viewsController');
const apiController = require('../controllers/apiController');
// const authController = require('../controllers/authController');

const router = express.Router();
//router.use(authController.isLoggedIn);

// begin:: API
router.get('/logs', apiController.getLogs);

router
  .route('/permissions/:permissionId?')
  .get(apiController.getPermissions)
  .post(apiController.createPermision)
  .patch(apiController.updatePermision);

// end:: API
router.get('*', viewsController.get404);

module.exports = router;
