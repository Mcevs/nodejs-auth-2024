const express = require('express')
const { uploadImageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const uploadMiddleware = require('../middlewares/upload-middleware')

const router = express.Router()
//
router.post(
  '/upload',
  [authMiddleware, adminMiddleware, uploadMiddleware.single('image')],
  uploadImageController
)


router.get('/get',authMiddleware,  fetchImagesController)
router.delete('/:id',authMiddleware, adminMiddleware, deleteImageController)

module.exports = router
 