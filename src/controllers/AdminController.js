import adminService from "../services/AdminService.js";

class AdminController {
  //[GET] /api/v1/admin/getAllData
  async getAllData(req, res) {
    try {
      const data = await adminService.getAllData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

   //[GET] /api/v1/admin/countPackage
  async countPackage(req, res) {
    try {
      const data = await adminService.countPackage();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}
export default new AdminController();