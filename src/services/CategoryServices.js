import { Category } from "../models/Category.js";

class CategoryService {
  async addNewCategories(models) {
    try {
      const categories = await Promise.all(
        models.map(async (model) => {
          const category = new Category(model);
          await category.save();
          return category;
        })
      );
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async searchCategoryByName(partialName) {
    try {
      const categories = await Category.find(
        { name: { $regex: new RegExp(partialName, "i") } },
        { name: 1, _id: 0 }
      );
      const response = categories.map((category) => category.name);

      return response;
    } catch (error) {
      throw new Error(`Error searching category: ${error.message}`);
    }
  }

  async getCategoryNames() {
    try {
      const categories = await Category.find({}, "name");
      return categories.map((category) => ({
        categoryName: category.name,
        id: category._id,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(categoryId) {
    try {
      const categories = await Category.find({ _id: categoryId });
      return categories;
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoryService();
