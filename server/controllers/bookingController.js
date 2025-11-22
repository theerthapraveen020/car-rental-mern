import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Function to check availability of a car for a given date range
const checkAvailability = async (carId, pickupDate, returnDate) => {
  
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0; // true = available
};

// API → Check availability of cars for date + location
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

   
    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const cars = await Car.find({location, isAvailable: true });

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id, start, end);
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, availableCars });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API → Create a booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);

    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);

    // Calculate price
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    const noOfDays = Math.ceil(
      (returned - picked) / (1000 * 60 * 60 * 24)
    );

    const price = carData.pricePerDay * noOfDays;

    // Create booking and return saved object
    const booking = await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      status: "pending",
    });

    res.json({
      success: true,
      message: "Booking Created",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API → Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API → Get owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API → Change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
