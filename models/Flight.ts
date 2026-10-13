import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema({
  flightId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  basePrice: { type: Number, required: true },
  calculatedPrice: { type: Number, required: true }, // Giá sau khi nhân 1.3 nếu là dịp lễ
  availableSeats: { type: Number, default: 200 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Flight = mongoose.models.Flight || mongoose.model("Flight", FlightSchema);

export default Flight;
