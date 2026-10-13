import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  flightId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  pax: { type: Number, required: true },
  pkg: { type: String, required: true },
  price: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: { type: String, required: true },
  idNumber: { type: String, required: true },
  seatNumber: { type: String, default: null }, // Thêm trường seatNumber để lưu ghế đã chọn
  status: { 
    type: String, 
    enum: ["PENDING", "PAID", "CANCELLED", "REFUND_PENDING"], 
    default: "PENDING" 
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
