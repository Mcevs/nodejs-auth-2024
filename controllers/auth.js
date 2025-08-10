const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body

    //check is any field is  empty
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ success: false, message: 'Please fill all fields' })
    }

    //check  existing users
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    })
    if (checkExistingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User  already exist' })
    }
    //if not empty then do the following
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)
    const newlyCreatedUser = await User.create({
      ...req.body,
      password: hashedpassword,
    })

    return res.status(201).json({
      success: true,
      message: 'Register Succesfully',
      newlyCreatedUser,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    //check if username or password  are empty
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide  username and password',
      })
    }

    //check if user exist
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      })
    }

    //check if password is match
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    console.log('match', isPasswordMatch)

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid credentials. Please  provide  correct username and password',
      })
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    return res
      .status(200)
      .json({ success: true, message: 'Logged in Succesfully', accessToken })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const {userId } = req.userInfo
    const { newpassword, oldpassword } = req.body


    //find the user with the above id
    const user = await User.findById( userId )
   
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      })
    }

    //check if the old password is correct

    const isPasswordMatch = await bcrypt.compare(oldpassword, user.password)

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'old password not correct! PLease try again',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const newlyHashedPassword = await bcrypt.hash(newpassword, salt)

    //update password
    user.password = newlyHashedPassword
    await user.save()
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    })
  }
}

module.exports = { login, register, changePassword }
