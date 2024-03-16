import { Report } from "../models/Report.js";
import { Art } from "../models/Art.js";
import NotificationServices from "./NotificationServices.js";
class ReportService {
  async createReport(reportData) {
    try {
      const report = new Report(reportData);
      await NotificationServices.sendReportAdminNotification(reportData);
      const savedReport = await report.save();
      return savedReport;
    } catch (error) {
      throw error;
    }
  }

  async getListReport() {
    try {
      const reportList = await Report.find({}).sort({
        createdAt: -1,
      });
      return reportList;
    } catch (error) {
      throw error;
    }
  }

  async getReportByArtId(artID) {
    try {
      const report = await Report.find({ artID: artID });
      return report;
    } catch (err) {
      throw err;
    }
  }

  async updateReportStatus(reportID, reportStatus) {
    try {
      const report = await Report.findByIdAndUpdate(
        reportID,
        { reportStatus: reportStatus },
        { new: true }
      );
      return report;
    } catch (err) {
      throw err;
    }
  }

  async sendWarning(report) {
    try {
      let typeWarning;
      const reportSave = await Report.findOne({ _id: report.key });
      const art = await Art.findOne({ _id: report.art_id });
      if (art.countReport < 5) {
        art.countReport += 1;
        typeWarning = "warning";
      }
      if (art.countReport >= 5) {
        art.status = false;
        typeWarning = "lock";
      }
      reportSave.reportStatus = false;
      await reportSave.save();
      await art.save();
      await NotificationServices.sendWarningNotification(report, typeWarning);
      return reportSave;
    } catch (err) {
      throw err;
    }
  }
}
export default new ReportService();
