import PaymentService from "../services/PaymentServices.js";

class PaymentController {
  async createPaymentUrl(req, res, next) {
    try {
      const { amount, accountId, type } = req.params;
      const vnpUrlPromise = PaymentService.createVnPayUrl(
        amount,
        accountId,
        type,
        req
      );
      const vnpUrl = await vnpUrlPromise;
      res.status(200).json(vnpUrl);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }

  async createPaymentUrlUpgrade(req, res, next) {
    try {
      const { amount, accountId, type } = req.params;
      const vnpUrlPromise = PaymentService.createVnPayUrlUpgrade(
        amount,
        accountId,
        type,
        req
      );
      const vnpUrl = await vnpUrlPromise;
      res.status(200).json(vnpUrl);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }

  async vnPayReturn(req, res, next) {
    try {
      const { query, params } = req;
      const { accountId, amount, type } = params;

      const savedPayment = await PaymentService.vnPayReturn(
        query,
        accountId,
        amount,
        type
      );
      res.redirect("https://pesterin.vercel.app/");
      return;
    } catch (error) {
      console.error("Failed to process VnPay return:", error.message);
      res.status(500).json({ error: "Failed to process VnPay return" });
      next(error);
    }
  }

  async vnPayReturnUpgrade(req, res, next) {
    try {
      const { query, params } = req;
      const { accountId, amount, type } = params;

      const savedPayment = await PaymentService.vnPayReturnUpgrade(
        query,
        accountId,
        amount,
        type
      );
      res.redirect("https://pesterin.vercel.app/");
      return;
    } catch (error) {
      console.error("Failed to process VnPay return:", error.message);
      res.status(500).json({ error: "Failed to process VnPay return" });
      next(error);
    }
  }
}

export default new PaymentController();
