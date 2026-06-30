const cloudinary = require("../../config/cloudinary");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");

const uploadImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one image", 400));
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  res.status(200).json({
    message: "Images uploaded successfully",
    data: images,
  });
});

const deleteImage = asyncHandler(async (req, res, next) => {
  const { publicId } = req.body;

  if (!publicId) {
    return next(new AppError("Please provide the image publicId", 400));
  }

  await cloudinary.uploader.destroy(publicId);

  res.status(200).json({
    message: "Image deleted successfully from Cloudinary",
  });

  return next(new AppError("Failed to delete image", 500));
});

module.exports = {
  uploadImages,
  deleteImage,
};
