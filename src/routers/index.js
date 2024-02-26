import AuthRouter from "./auth.js";
import UserRouter from "./user.js";
import SaveRouter from "./save.js";
import ReportRouter from "./report.js";
import vnpayRouter from "./vnpayRouter.js";
import FollowRouter from "./follow.js";
import ArtRouter from "./art.js";

const route = (app) => {
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/save", SaveRouter);
  app.use("/api/v1/report", ReportRouter);
  app.use("/api/v1/vnpay", vnpayRouter);
  app.use("/api/v1/follow", FollowRouter);
  app.use("/api/v1/art", ArtRouter);
};

export default route;
