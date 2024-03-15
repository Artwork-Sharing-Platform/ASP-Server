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
//[Get] /api/v1/report/getListReport
  async getListReport(req, res) {
    try {
      const reportList = await reportService.getListReport();
      return res.status(200).json({ success: true, data: reportList });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //[GET] /api/v1/report/:artID
  async getReportByArtId(req, res) {
    try {
      const data = await reportService.getReportByArtId(req.params.artID);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
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
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default new ReportController();
