import UserService from "../services/UserServices.js";

class UserController {
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const userUpdate = req.body;
      const user = await UserService.updateUserById(id, userUpdate);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }

  async getListUserByName(req, res) {
    try {
      const { userName } = req.params;

      const userList = await UserService.getListUserByName(userName);
      res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListUserByEmail(req, res) {
    try {
      const { email } = req.params;

      const userList = await UserService.getListUserByEmail(email);
      res.status(200).json({ success: true, data: userList });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getListUser(req, res) {
    try {
      const userList = await UserService.getListUser();
      return res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatusUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateStatus = req.body;

      const updatedUser = await UserService.updateStatus(id, updateStatus);

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }
}

export default new UserController();
