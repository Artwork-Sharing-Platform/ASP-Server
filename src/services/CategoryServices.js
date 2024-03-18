import { Category } from "../models/Category.js";

class CategoryService {
  async addNewCategories(models) {
    const categories = await Promise.all(models.map(async (model) => {
      const category = new Category(model);
      await category.save();
      return category;
    }));
    return categories;
  }

  async searchCategoryByName(partialName) {
    const categories = await Category.find(
      { name: { $regex: new RegExp(partialName, "i") } },
      { name: 1, _id: 0 }
    );
    return categories.map((category) => category.name);
  }

  async getCategoryNames() {
    return Category.find({}, "name").map((category) => ({
      categoryName: category.name,
      id: category._id,
    }));
  }

  async getCategoryById(categoryId) {
    return Category.find({ _id: categoryId });
  }
}

export default new CategoryService();
