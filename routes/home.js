const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/welcome', authMiddleware, (req, res) => {
  const { userId, role, username } = req.userInfo
  res.status(200).json({
    success: true,
    message: 'Welcome to the home page',
    user: {
      _id:userId,
      username, 
      role,
    },
  })
})

module.exports = router
