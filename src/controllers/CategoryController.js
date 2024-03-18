import CategoryServices from "../services/CategoryServices.js";

class CategoryController {

  // Add a new category
  async addCategory(req, res, next) {
    try {
      const addCategory = req.body;
      await CategoryServices.addNewCategories(addCategory);
      res.status(200).json("Category added successfully!");
    } catch (error) {
      handleError(res, error);
      next(error);
    }
  }

  // Get a category by ID
  async getCategoryById(req, res, next) {
    try {
      const { categoryId } = req.params;
      const categories = await CategoryServices.getCategoryById(categoryId);
      if (!categories) {
        res.status(404).json({ message: "Category not found" });
      } else {
        res.status(200).json(categories);
      }
    } catch (error) {
      handleError(res, error);
      next(error);
    }
  }

  // Search categories by name
  async searchCategoryByName(req, res, next) {
    try {
      const { name } = req.params;
      const foundCategories = await CategoryServices.searchCategoryByName(name);

      if (foundCategories.length === 0) {
        res.status(404).json({ message: "No categories found" });
      } else {
        res.status(200).json(foundCategories);
      }
    } catch (error) {
      handleError(res, error);
      next(error);
    }
  }
}

function handleError(res, error) {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
}

export default new CategoryController();
