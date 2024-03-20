import {
  vnp_TmnCode,
  vnp_HashSecret,
  vnp_Url,
  vnp_ReturnUrl,
  vnp_ReturnUrlUpgrade,
} from "../config/vnPay/vnpay.js";
import dateFormat from "dateformat";
import querystring from "qs";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Feature } from "../models/Feature.js";
import PackageServices from "./PackageServices.js";
import NotificationServices from "./NotificationServices.js";
import {
  PAYOS_API_KEY,
  PAYOS_CLIENT_ID,
  PAYOS_RETURN_URL,
  PAYOS_CHECKSUM_KEY,
  PAYOS_RETURN_URL_FAIL
} from "../config/PayOS/PayOS.js";
import PayOS from "@payos/node";
const payos = new PayOS(PAYOS_CLIENT_ID,PAYOS_API_KEY,PAYOS_CHECKSUM_KEY)

class PaymentService {
  async createVnPayUrl(amount, accountId, type, req) {
    try {
      let ipAddr =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      var tmnCode = vnp_TmnCode;
      var secretKey = vnp_HashSecret;
      var vnpUrl = vnp_Url;
      var returnUrl = vnp_ReturnUrl;
      var date = new Date();
      var orderId = dateFormat(date, "HHmmss");
      var orderType = "sales";
      var locale = "vn";
      var currCode = "VND";
      if (!accountId) {
        throw new Error("accountId is required");
      }
      var newDate = new Date();
      newDate.setDate(newDate.getDate() + 1);
      var newCreateDate = dateFormat(newDate, "yyyymmddHHmmss");
      var vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_BankCode: "NCB",
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: "Payment for transaction code: " + orderId,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: `${returnUrl}/${accountId}/${amount}/${type}`,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: newCreateDate,
      };
      vnp_Params = this.sortObject(vnp_Params);
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      return vnpUrl;
    } catch (error) {
      throw error;
    }
  }

  async vnPayReturn(query, accountId, amount, type) {
    try {
      const {
        vnp_ResponseCode,
        vnp_TxnRef,
        vnp_Amount,
        vnp_PayDate,
        vnp_OrderInfo,
        vnp_TransactionStatus,
      } = query;

      // Validate accountId
      if (!accountId) {
        throw new Error("accountId is required");
      }

      // Check VNPAY response
      if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
        // Payment successful, save to MongoDB
        const savedPayment = await Payment.create({
          amount: vnp_Amount,
          accountId,
          orderId: vnp_TxnRef,
          paymentDate: vnp_PayDate,
          description: vnp_OrderInfo,
          status: "success",
        });

        // Handel add package and feature
        const businessFeatureCounts = {
          isWatermark: false,
          countSave: 70,
          countDownload: 30,
          countAds: 15,
          countPostPrivate: 15,
        };

        const enterpriseFeatureCounts = {
          isWatermark: true,
          countSave: 200,
          countDownload: 100,
          countAds: 50,
          countPostPrivate: 50,
        };

        if (type === "Business") {
          await this.createPackageAndFeatures(
            type,
            accountId,
            amount,
            businessFeatureCounts
          );
        } else if (type === "Enterprise") {
          await this.createPackageAndFeatures(
            type,
            accountId,
            amount,
            enterpriseFeatureCounts
          );
        }

        // Send notification
        await NotificationServices.sendPaymentPackageNotification(
          accountId,
          type,
          amount
        );

        return savedPayment;
      } else {
        // Handle unsuccessful payment
        console.error("Payment failed:", {
          vnp_ResponseCode,
          vnp_TransactionStatus,
        });

        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Failed to process VnPay return:", error.message);
      throw error;
    }
  }

  async createVnPayUrlUpgrade(amount, accountId, type, req) {
    try {
      let ipAddr =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      var tmnCode = vnp_TmnCode;
      var secretKey = vnp_HashSecret;
      var vnpUrl = vnp_Url;
      var returnUrl = vnp_ReturnUrlUpgrade;
      var date = new Date();
      var orderId = dateFormat(date, "HHmmss");
      var orderType = "sales";
      var locale = "vn";
      var currCode = "VND";
      if (!accountId) {
        throw new Error("accountId is required");
      }
      var newDate = new Date();
      newDate.setDate(newDate.getDate() + 1);
      var newCreateDate = dateFormat(newDate, "yyyymmddHHmmss");
      var vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_BankCode: "NCB",
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: "Payment for transaction code: " + orderId,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: `${returnUrl}/${accountId}/${amount}/${type}`,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: newCreateDate,
      };
      vnp_Params = this.sortObject(vnp_Params);
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      return vnpUrl;
    } catch (error) {
      throw error;
    }
  }

  async vnPayReturnUpgrade(query, accountId, amount, type) {
    try {
      const {
        vnp_ResponseCode,
        vnp_TxnRef,
        vnp_Amount,
        vnp_PayDate,
        vnp_OrderInfo,
        vnp_TransactionStatus,
      } = query;

      // Validate accountId
      if (!accountId) {
        throw new Error("accountId is required");
      }

      // Check VNPAY response
      if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
        // Payment successful, save to MongoDB
        const savedPayment = await Payment.create({
          amount: vnp_Amount,
          accountId,
          orderId: vnp_TxnRef,
          paymentDate: vnp_PayDate,
          description: vnp_OrderInfo,
          status: "success",
        });

        // Handel add package and feature
        const businessFeatureCounts = {
          isWatermark: false,
          countSave: 70,
          countDownload: 30,
          countAds: 15,
          countPostPrivate: 15,
        };

        const enterpriseFeatureCounts = {
          isWatermark: true,
          countSave: 200,
          countDownload: 100,
          countAds: 50,
          countPostPrivate: 50,
        };

        if (type === "Business") {
          await this.updateFeatureByUserId(
            accountId,
            businessFeatureCounts,
            type,
            amount
          );
        } else if (type === "Enterprise") {
          await this.updateFeatureByUserId(
            accountId,
            enterpriseFeatureCounts,
            type,
            amount
          );
        }

        //Send notification
        await NotificationServices.sendPaymentUpgradePackageNotification(
          accountId,
          type,
          amount
        );
        return savedPayment;
      } else {
        // Handle unsuccessful payment
        console.error("Payment failed:", {
          vnp_ResponseCode,
          vnp_TransactionStatus,
        });

        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Failed to process VnPay return:", error.message);
      throw error;
    }
  }

  sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  async createPackageAndFeatures(type, accountId, amount, featureCounts) {
    const packageData = {
      userId: accountId,
      name: type,
      price: amount,
    };

    const packageResponse = await PackageServices.addPackage(packageData);

    const featureData = {
      userId: accountId,
      packageId: packageResponse._id,
      ...featureCounts,
    };

    await PackageServices.addFeature(featureData);
  }

  async updateFeatureByUserId(userId, newFeatureData, type, amount) {
    try {
      const packageData = {
        userId: userId,
        name: type,
        price: amount,
      };
      const packageResponse = await PackageServices.addPackage(packageData);
      const existingFeature = await Feature.findOne({ userId: userId });
      existingFeature.packageId = packageResponse._id;

      if (!existingFeature) {
        throw new Error("Feature not found for the given userId");
      }

      if (newFeatureData.isWatermark) {
        existingFeature.isWatermark = true;
      }

      existingFeature.countSave =
        newFeatureData.countSave !== undefined && newFeatureData.countSave >= 0
          ? existingFeature.countSave + newFeatureData.countSave
          : existingFeature.countSave;

      existingFeature.countDownload =
        newFeatureData.countDownload !== undefined &&
        newFeatureData.countDownload >= 0
          ? existingFeature.countDownload + newFeatureData.countDownload
          : existingFeature.countDownload;

      existingFeature.countAds =
        newFeatureData.countAds !== undefined && newFeatureData.countAds >= 0
          ? existingFeature.countAds + newFeatureData.countAds
          : existingFeature.countAds;

      existingFeature.countPostPrivate =
        newFeatureData.countPostPrivate !== undefined &&
        newFeatureData.countPostPrivate >= 0
          ? existingFeature.countPostPrivate + newFeatureData.countPostPrivate
          : existingFeature.countPostPrivate;

      await existingFeature.save();
    } catch (error) {
      console.error(
        `Error updating feature for userId ${userId}: ${error.message}`
      );
    }
  }

  async createPaymentUrlRegisterCreator(accountId){
    try {
        
        const amount = 15000;
        
        const result = await payos.createPaymentLink({
            amount: amount,
            orderCode: Math.floor(Math.random() * 1000) + 1,
            description: "VQRIO123",
            cancelUrl: `https://www.messenger.com/e2ee/yt/6531991546907385`,
            returnUrl: `https://www.messenger.com/e2ee/t/6531991546907385`,
            expiredAt: Date.now,
            signature: 'xxxx',
            items: [],
        })
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}
}
export default new PaymentService();
