const express = require('express');
const router = express.Router()
const authControllers = require('../controllers/auth.controller')

router.post('/register', authControllers.registerController)
router.post('/login', authControllers.loginController)

module.exports = router