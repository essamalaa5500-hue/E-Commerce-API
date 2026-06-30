const cloudinary = require("../../config/cloudinary");
const AppError = require("../../utils/AppError");

const uploadImages = async (req, res, next) => {
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
};

const deleteImage = async (req, res, next) => {
  const { publicId } = req.body;

  if (!publicId) {
    return next(new AppError("Please provide the image publicId", 400));
  }

  try {
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      message: "Image deleted successfully from Cloudinary",
    });
  } catch (error) {
    return next(new AppError("Failed to delete image", 500));
  }
};

module.exports = {
  uploadImages,
  deleteImage,
};
