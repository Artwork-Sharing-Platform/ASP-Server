import adminService from "../services/AdminService.js";

class AdminController {
  async getAllData(req, res) {
    try {
      const data = await adminService.getAllData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}
export default new AdminController();