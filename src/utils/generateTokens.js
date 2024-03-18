import jwt from "jsonwebtoken";

export async function generateTokens(user) {
  // Create a access token
  const accessToken = jwt.sign(
    { userId: user._id, role: user.type },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "1m" }
  );

  // Create a refresh token
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.type },
    process.env.REFRESH_TOKEN_SECRET_KEY
  );
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
}
