import mongoose, { Document, Schema } from 'mongoose';
import { PassengerSchema, IPassenger } from './PassengerSchema'; // Import schema nhúng

export interface IBooking extends Document {
  pnr: string;
  user: mongoose.Types.ObjectId;
  flight: mongoose.Types.ObjectId;
  passengers: IPassenger[];
  fareClassSelections: Array<{
    fareClass: mongoose.Types.ObjectId;
    quantity: number;
    pricePerPassenger: number; // Giá tại thời điểm đặt vé
  }>;
  totalAmount: number;
  status: 'CREATED' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  pnr: { type: String, required: true, unique: true, minlength: 6, maxlength: 6 },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
  passengers: { type: [PassengerSchema], required: true },
  fareClassSelections: [{
    fareClass: { type: Schema.Types.ObjectId, ref: 'FareClass', required: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePerPassenger: { type: Number, required: true, min: 0 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['CREATED', 'PENDING_PAYMENT', 'PAID', 'CANCELLED', 'EXPIRED'], default: 'PENDING_PAYMENT' },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);