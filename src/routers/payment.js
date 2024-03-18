import express from "express";
const router = express.Router();

import paymentController from "../controllers/PaymentController.js";

router.get(
  "/create_payment_url/:amount/:accountId/:type",
  paymentController.createPaymentUrl
);
router.get(
  "/create_payment_url_upgrade/:amount/:accountId/:type",
  paymentController.createPaymentUrlUpgrade
);
router.get(
  "/return_Url/:accountId/:amount/:type",
  paymentController.vnPayReturn
);

router.get(
  "/return_Url_upgrade/:accountId/:amount/:type",
  paymentController.vnPayReturnUpgrade
);

router.get(
  "/createPaymentUrl",
  paymentController.createPaymentUrlRegisterCreator
);

export default router;
