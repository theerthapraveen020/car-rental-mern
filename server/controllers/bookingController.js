import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, price } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });

    const booking = await Booking.create({
      car: car._id,
      user: req.user._id,
      owner: car.owner,
      pickupDate,
      returnDate,
      price,
    });

    res.json({ success: true, message: "Booking created", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get bookings of current user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("car")
      .populate("owner");

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get bookings of cars owned by current owner
export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const bookings = await Booking.find({ owner: ownerId })
      .populate("car")
      .populate("user");

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch owner bookings" });
  }
};

// Change booking status (pending, confirmed, cancelled)
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check availability of cars
export const checkAvailability = async (req, res) => {
  try {
    const { pickupDate, returnDate, location } = req.body;

    const bookings = await Booking.find({
      $or: [
        { pickupDate: { $lte: returnDate }, returnDate: { $gte: pickupDate } },
      ],
    });

    const bookedCarIds = bookings.map((b) => b.car.toString());
    const allCars = await Car.find({ location });
    const availableCars = allCars.filter((car) => !bookedCarIds.includes(car._id.toString()));

    res.json({ success: true, availableCars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
