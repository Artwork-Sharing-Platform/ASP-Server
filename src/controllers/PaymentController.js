import PaymentService from "../services/PaymentServices.js";

class PaymentController {

  // [GET] /api/v1/payment/create_payment_url/:amount/:accountId/:type
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

  // [GET] /api/v1/payment/create_payment_url_upgrade/:amount/:accountId/:type
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

  // [GET] /api/v1/payment/return_Url/:accountId/:amount/:type
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
      res.status(500).json({ error: error.message });
      next();
    }
  }

  // [GET] /api/v1/payment/return_Url_upgrade/:accountId/:amount/:type
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
      res.status(500).json({ error: error.message });
      next();
    }
  }

  async createPaymentUrlRegisterCreator(req, res){
    try {
        const { accountId } = req.params;
        const url = await PaymentService.createPaymentUrlRegisterCreator(accountId);
        res.redirect(url.checkoutUrl)
    } catch (error) {
        res.status(500).send(error)
    }
}
}



export default new PaymentController();
