const express = require("express");
const router = express.Router();
const UsersController = require('../controllers/users');
const auth = require("../middleware/auth");
const authenticate = require('../middleware/auth')

router
    .route('/')
    .post(UsersController.create)
    .all(authenticate)
    .get(UsersController.read)

router
    .route('/login')
    .post(UsersController.login)

module.exports = router;