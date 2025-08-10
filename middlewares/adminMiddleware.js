const adminMiddleware = (req, res, next) => {
  const { role, user, userId } = req.userInfo

  if (role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'Access  denied! admin rights required' })
  }
  next()
}

module.exports = adminMiddleware
