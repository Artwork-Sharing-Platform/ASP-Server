import AuthService from "../services/AuthServices.js";

class AuthController {
  // [POST] /api/v1/auth/login
  async login(req, res, next) {
    try {
      const loginData = req.body;
      const loginInfo = await AuthService.login(loginData);
      res.status(200).json(loginInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  // [POST] /api/v1/auth/google
  async google(req, res, next) {
    try {
      const googleAccess = await AuthService.google(req.body);
      res.status(200).json(googleAccess);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  async loginMobile(req, res, next) {
    try {
        const loginMobile = await AuthService.loginMobile(req.body);
        res.status(200).json(loginMobile);
    }
    catch (error) {
      res.status(500).json({ message: error.message });
      next();
  }
}

  // [POST] /api/v1/auth/signup
  async signup(req, res, next) {
    try {
      const signupData = req.body;
      const userData = await AuthService.signup(signupData);
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  // [POST] /api/v1/auth/token
  async refreshAccessToken(req, res, next) {
    const { refreshToken } = req.body;
    try {
      if (!refreshToken) {
        res.status(401);
      }
      const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  // [POST] /api/v1/auth/logout
  async logout(req, res, next) {
    const { refreshToken } = req.body;
    try {
      if (!refreshToken) {
        res.status(401);
      }
      const message = await AuthService.logout(refreshToken);
      res.status(200).json({ message: message });
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }
}

export default new AuthController();
