const Category = require("../models/Category");
const AppError = require("../../utils/AppError");
const paginate = require("../../middleware/paginate");

const getAllCategories = async (req, res) => {
  const categories = await req.paginate(Category.find());
  res.json({ message: "All Categories", data: categories });
};

const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Category not found", 404));
  }
  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.json({ message: `Category ${category.name} found`, data: category });
};
const createCategory = async (req, res, next) => {
  const { name, description, image } = req.body;
  const createdCategory = await Category.create({ name, description, image });
  res.json({
    message: `Category ${createdCategory.name} Created Successfully`,
    data: createdCategory,
  });
};
const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Category not found", 404));
  }
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedCategory) {
    return next(new AppError("Category not found", 404));
  }
  res.json({
    message: `Category ${updatedCategory.name} Updated Successfully`,
    data: updatedCategory,
  });
};
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Category not found", 404));
  }
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new AppError("Category not found", 404));
  }
  res.json({
    message: `Category ${deletedCategory.name} Deleted Successfully`,
    data: deletedCategory,
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
