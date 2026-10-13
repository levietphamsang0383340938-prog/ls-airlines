import mongoose from "mongoose";

const BookingHistorySchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  flightId: { type: String, required: true },
  fullName: { type: String, required: true },
  action: { 
    type: String, 
    enum: ["CANCELLED_BY_USER", "PAYMENT_EXPIRED", "FLIGHT_COMPLETED"], 
    required: true 
  },
  reason: { type: String, default: "" },
  price: { type: String, required: true },
  refundAmount: { type: String, default: "0 VND" },
  createdAt: { type: Date, default: Date.now }
});

const BookingHistory = mongoose.models.BookingHistory || mongoose.model("BookingHistory", BookingHistorySchema);

export default BookingHistory;
