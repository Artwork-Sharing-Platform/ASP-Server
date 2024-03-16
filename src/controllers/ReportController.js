import e from "express";
import reportService from "../services/ReportServices.js";

class ReportController {
  //[POST] /api/v1/report/createReport
  async createReport(req, res, next) {
    try {
      const reportData = req.body;
      const createdReport = await reportService.createReport(reportData);
      res.status(201).json(createdReport);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }
//[GET] /api/v1/report/getListReport
  async getListReport(req, res) {
    try {
      const reportList = await reportService.getListReport();
      return res.status(200).json(reportList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //[GET] /api/v1/report/:artID
  async getReportByArtId(req, res) {
    try {
      const data = await reportService.getReportByArtId(req.params.artID);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message});
    }
  }
  
  //[PUT] /api/v1/report/:reportID
  async updateReportStatus(req, res) {
    try {
      const data = await reportService.updateReportStatus(
        req.params.reportID,
        req.body.reportStatus
      );
      res.status(200).json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  //[POST] /api/v1/report/sendWarning
  async sendWarning(req, res) {
    try {
      const report = req.body;
      const result = await reportService.sendWarning(report);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
export default new ReportController();
