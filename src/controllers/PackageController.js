import packageService from "../services/PackageServices.js";
class PackageController {
  //[POST] /api/v1/package/addPackage
  async addPackage(req, res) {
    try {
      const packageData = req.body;
      const packageResponse = await packageService.addPackage(packageData);
      res.status(200).json(packageResponse);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
//[POST] /api/v1/package/addFeature
  async addFeature(req, res) {
    try {
      const featureData = req.body;
      const feature = await packageService.addFeature(featureData);
      res.status(200).json(feature);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
//[POST] /api/v1/package/free-trial-package
  async freeTrialPackage(req, res) {
    try {
      const freeTrialPackage = req.body;
      const result = await packageService.freeTrialPackage(freeTrialPackage);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message});
    }
  }
//[GET] /api/v1/package/getPackageName/:id
  async getPackageName(req, res) {
    try {
      const { id } = req.params;
      const name = await packageService.getPackageName(id);
      res.status(200).json(name);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
//[GET] /api/v1/package/getFeatureByUserId/:userId
  async getFeatureByUserId(req, res) {
    try {
      const { userId } = req.params;
      const feature = await packageService.getFeatureByUserId(userId);
      res.status(200).json(feature);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  //[GET] /api/v1/package/decreaseDownloadCount/:userId/:packageId
  async decreaseDownloadCount(req, res) {
    try {
      const { userId, packageId } = req.params;
      const feature = await packageService.decreaseDownloadCount(
        userId,
        packageId
      );
      res.status(200).json(feature);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new PackageController();
