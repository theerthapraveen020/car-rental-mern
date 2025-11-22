import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user]);

  if (loading)
    return <p className="text-center mt-8">Loading your bookings...</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-8">You have no bookings yet.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
              initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay:index*0.1,duration: 0.4 }}

            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Car image + info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.car?.image || assets.car_placeholder}
                  className="w-full h-auto aspect-video object-cover"
                  alt={booking.car?.model || "Car image"}
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking.car?.brand || "-"} {booking.car?.model || "-"}
              </p>
              <p className="text-gray-500">
                {booking.car?.year || "-"} ● {booking.car?.category || "-"} ●{" "}
                {booking.car?.location || "-"}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </p>
              </div>

              {/* Rental period & Pick-up Location */}
              <div className="flex flex-col items-start gap-4 mt-4">
                {/* Rental period */}
                <div className="flex items-start gap-2">
                  <img
                    src={assets.calendar_icon_colored}
                    className="w-4 h-4 mt-1"
                    alt="Calendar icon"
                  />
                  <div>
                    <p className="text-gray-500">Rental period</p>
                    <p>
                      {new Date(booking.pickupDate).toLocaleDateString("en-IN")}{" "}
                      →{" "}
                      {new Date(booking.returnDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Pick-up Location */}
                <div className="flex items-start gap-2">
                  <img
                    src={assets.location_icon}
                    className="w-4 h-4 mt-1"
                    alt="Location icon"
                  />
                  <div>
                    <p className="text-gray-500">Pick-up Location</p>
                    <p>{booking.car?.location || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="md:col-span-1 flex flex-col justify-between text-right">
              <div className="text-sm text-gray-500">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}
                  {booking.price}
                </h1>
                <p>
                  Booked on{" "}
                  {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBookings;
