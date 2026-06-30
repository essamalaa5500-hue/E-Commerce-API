const express = require("express");
const router = express.Router();
const verfiyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");
const upload = require("../../middleware/uploadImage");
const {
  uploadImages,
  deleteImage,
} = require("../controllers/uploadController");

router.post(
  "/",
  verfiyToken,
  verifyAdmin,
  upload.array("images", 5),
  uploadImages,
);
router.delete("/", verfiyToken, verifyAdmin, deleteImage);

module.exports = router;
