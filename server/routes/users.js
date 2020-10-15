const express = require("express");
const router = express.Router();
const UsersController = require('../controllers/users');

router
    .route('/')
    .post(UsersController.create)
    .get(UsersController.read)

module.exports = router;