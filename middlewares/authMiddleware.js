const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const { authorization: authHeaders } = req.headers

  //check if the user is loggin in
  const token = authHeaders && authHeaders.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided. Please log in to  continue',
    })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.userInfo = decodedToken
    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}




module.exports = authMiddleware
