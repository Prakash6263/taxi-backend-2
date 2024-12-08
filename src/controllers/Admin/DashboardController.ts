import _RS from "../../helpers/ResponseHelper";
import Rides from "../../models/Rides";
import User from "../../models/User";
export class DashboardController {
  static async dashboardData(req, res, next) {
    try {
      const totalUser = await User.countDocuments({
        isVerify: true,
        is_deleted: false,
      });
      const totalCustomer = await User.countDocuments({
        type: "User",
        isVerify: true,
        is_deleted: false,
      });
      const totalDriver = await User.countDocuments({
        type: "Driver",
        isVerify: true,
        is_deleted: false,
      });
      const lastTrip = await Rides.find()
        .populate("hotel")
        .sort({ created_at: -1 })
        .limit(20);
      const driverRequest = await User.find({
        type: "Driver",
        isApprove: false,
        is_active: true,
        isVerify: true,
        is_deleted: false,
      })
        .sort({ created_at: -1 })
        .limit(5);

      const totalDriverList = await User.find({
        type: "Driver",
        isVerify: true,
        is_deleted: false,
        isOnline: true,
      });

      const data = {
        totalUser,
        totalCustomer,
        totalDriver,
        lastTrip,
        driverRequest,
      };
      return _RS.ok(res, "SUCCESS", "List", data, new Date().getTime());
    } catch (error) {}
  }
}
