const express = require('express')
const router = express.Router()
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const adminPage = require('../controllers/admin')

router.get('/welcome', authMiddleware, adminMiddleware, adminPage)

module.exports = router
 