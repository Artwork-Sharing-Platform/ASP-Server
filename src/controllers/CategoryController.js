import CategoryServices from "../services/CategoryServices.js";

class CategoryController {
  //[POST] /api/v1/category/addCategory
  async addCategory(req, res, next) {
    try {
      const addCategory = req.body;
      await CategoryServices.addNewCategories(addCategory);
      res.status(200).json("Category added successfully!");
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/category/getCategoryById/:categoryId
  async getCategoryById(req, res, next) {
    try {
      const { categoryId } = req.params;
      const categories = await CategoryServices.getCategoryById(categoryId);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/category/search/:name
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
      res.status(500).json({ message: error.message });
      next();
    }
  }
}

export default new CategoryController();
