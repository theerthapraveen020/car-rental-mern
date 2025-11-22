import express from "express";
import { Protect } from "../middleware/auth.js";
import {
  addCar,
  changeRoleOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();
ownerRouter.post("/change-role", Protect, changeRoleOwner);
ownerRouter.post("/add-car", Protect, upload.single("image"), addCar);
ownerRouter.get("/cars", Protect, getOwnerCars);
ownerRouter.post("/toggle-car", Protect, toggleCarAvailability);
ownerRouter.post("/delete-car", Protect, deleteCar);
ownerRouter.get("/dashboard", Protect, getDashboardData);
ownerRouter.post(
  "/update-image",
  upload.single("image"),
  Protect,
  updateUserImage
);
export default ownerRouter;
