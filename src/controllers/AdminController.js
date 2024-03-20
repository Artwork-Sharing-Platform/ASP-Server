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

  // [GET] /api/v1/admin/getListUser
  async getListUser(req, res) {
    try {
      const userList = await adminService.getListUser();
      return res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //[GET] /api/v1/admin/getArtwork
  async getAllArtwork(req, res, next) {
    try {
      const artWorks = await adminService.getAllArtwork();
      res.status(200).json(artWorks);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  // [POST] /api/v1/admin/updateStatusUser/:id
  async updateStatusUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateStatus = req.body;

      const updatedUser = await adminService.updateStatus(id, updateStatus);

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }

  //[POST] /api/v1/admin/updateArtworkStatus
  async updateArtworkStatus(req, res, next) {
    try {
      const art = req.body;
      const artWork = await adminService.updateArtworkStatus(art);
      res.status(200).json(artWork);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
export default new AdminController();
