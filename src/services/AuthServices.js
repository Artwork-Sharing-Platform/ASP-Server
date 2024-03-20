import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { generateTokens } from "../utils/generateTokens.js";
class AuthService {
  async login(loginData) {
    try {
      let user;
      if (validator.isEmail(loginData.email)) {
        user = await User.findOne({ email: loginData.email });
      } else {
        throw new Error("Invalid email address. Please provide a valid email.");
      }

      if (!user) {
        throw new Error("User not found. Please check your credentials.");
      }

      if (!user.status) {
        throw new Error("Your account has been locked.");
      }

      if (loginData.password) {
        const isPasswordValid = await bcrypt.compare(
          loginData.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Password incorrect. Please check your credentials.");
        }
        const tokens = await generateTokens(user);
        return { user, tokens };
      } else {
        throw new Error("Password is required for login.");
      }
    } catch (error) {
      throw error;
    }
  }

  async google(userData) {
    try {
      let user;
      user = await User.findOne({ email: userData.email });
      if (user) {
        if (!user.status) {
          throw new Error("Your account has been locked.");
        }
        const tokens = await generateTokens(user);
        return { user, tokens };
      } else {
        user = new User({
          firstName: userData.given_name,
          lastName: userData.family_name,
          userName: userData.name,
          email: userData.email,
          avatar: userData.picture,
        });
        await user.save();
        const tokens = await generateTokens(user);
        return { user, tokens };
      }
    } catch (error) {
      throw error;
    }
  }

  async signup(userData) {
    try {
      let newUser = new User(userData);

      if (!userData.email || !userData.password || !userData.dob) {
        throw new Error(
          "All fields (email, password, date of birth) are required."
        );
      }

      if (validator.isEmail(userData.email)) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          throw new Error("Duplicate email. Please try a different email.");
        }
        newUser.email = userData.email;
      } else {
        throw new Error("Invalid email address. Please provide a valid email.");
      }

      if (userData.password !== null && userData.password !== undefined) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        newUser.password = hashedPassword;
      } else {
        throw new Error("Password is required.");
      }

      newUser.avatar =
        "https://firebasestorage.googleapis.com/v0/b/social-media-app-44a6c.appspot.com/o/user-default.png?alt=media&token=cb979468-87df-4233-9def-57459113250e";

      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error("Refresh token is missing.");
      }

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );

      const user = await User.findById(decodedRefreshToken.userId);

      if (!user) {
        throw new Error("User not found.");
      }

      if (user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token.");
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, role: user.type },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "1m" }
      );

      return newAccessToken;
    } catch (error) {
      throw error;
    }
  }

  async logout(refreshToken) {
    try {
      const user = await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found.");
      } else {
        const message = `Deleted refresh token: ${refreshToken}`;
        return message;
      }
    } catch (error) {
      throw error;
    }
  }

  async loginMobile(userData) {
    try {
      let user;
      user = await User.findOne({ email: userData.email });
      if (user) {
        return { user };
      } else {
        user = new User({
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          email: userData.email,
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/social-media-app-44a6c.appspot.com/o/user-default.png?alt=media&token=cb979468-87df-4233-9def-57459113250e",
        });
        await user.save();

        return { user };
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
