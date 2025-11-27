import express from "express";
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  changeBookingStatus,
  checkAvailability,
} from "../controllers/bookingController.js";

import { Protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", Protect, createBooking);
router.get("/user", Protect, getUserBookings);
router.get("/owner", Protect, getOwnerBookings);
router.post("/change-status", Protect, changeBookingStatus);
router.post("/check-availability", Protect, checkAvailability); // ✅ new route

export default router;
