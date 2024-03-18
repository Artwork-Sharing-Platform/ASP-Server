import jwt from "jsonwebtoken";

export const authenticateToken = (requiredRoles) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(401);

    if (!user.role || !requiredRoles.includes(user.role)) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};
