import mongoose, { Document, Schema } from 'mongoose';

export interface IFlight extends Document {
  flightCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  // Lưu trữ số ghế còn trống cho từng hạng vé được cung cấp bởi chuyến bay này
  // Key sẽ là FareClass._id và Value là số lượng
  availableSeatsByClass: Map<string, number>; // Map<FareClassId, count>
  status: 'Scheduled' | 'Cancelled' | 'Delayed';
}

const FlightSchema: Schema = new Schema({
  flightCode: { type: String, required: true, unique: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  availableSeatsByClass: {
    type: Map,
    of: Number,
    default: {},
  },
  status: { type: String, enum: ['Scheduled', 'Cancelled', 'Delayed'], default: 'Scheduled' },
}, { timestamps: true });

export default mongoose.models.Flight || mongoose.model<IFlight>('Flight', FlightSchema);