const express = require('express')
const router = express.Router()
const {login, register, changePassword} = require('../controllers/auth')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/change-password', authMiddleware,changePassword)

module.exports = router