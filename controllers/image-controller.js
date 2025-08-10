const Image = require('../models/images')
const { uploadToCloudinary } = require('../helpers/cloudinary-helper')
const fs = require('fs')
const { findById } = require('../models/user')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        mesage: 'File is required! Please upload a file',
      })
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path)

    const newlyUplaodedImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    })
    //delete the  file from local  storage
    fs.unlinkSync(req.file.path)

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      image: newlyUplaodedImage,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Something  went worng! Please try again',
    })
  }
}

const fetchImagesController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit

    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;


    const totalImages = await Image.countDocuments()
    const totalPages = Math.ceil(totalImages / limit)
    const sortObj = {}
    sortObj[sortBy] = sortOrder

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit)

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages:totalImages, 
        data: images,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Something went worng! Please try again',
    })
  }
}

const deleteImageController = async (req, res) => {
  try {
    const getCurrentIdOfImageToBeDeleted = req.params.id
    const { userId } = req.userInfo

    const image = await Image.findById(getCurrentIdOfImageToBeDeleted)
    console.log('image:', image)

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not  found',
      })
    }
    //check if the image is uploaded  by the user trying to delete it
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to  delete this image',
      })
    }
    //delete this image first from your cloudinary storage
    await cloudinary.uploader.destroy(image.publicId)
    //delete this image from mongodb Database
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.mesage,
    })
  }
}

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
}
