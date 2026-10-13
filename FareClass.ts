import mongoose, { Document, Schema } from 'mongoose';

export interface IFareClass extends Document {
  flight: mongoose.Types.ObjectId;
  className: string;
  basePrice: number;
  taxes: number;
  conditions: Record<string, any>; // Đối tượng linh hoạt cho các điều kiện vé
  totalSeats: number; // Tổng số ghế cho hạng vé này trên chuyến bay này
}

const FareClassSchema: Schema = new Schema({
  flight: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
  className: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
  taxes: { type: Number, default: 0, min: 0 },
  conditions: { type: Object, default: {} },
  totalSeats: { type: Number, required: true, min: 0 }, // Tổng số ghế ban đầu cho hạng vé này
}, { timestamps: true });

// Thêm chỉ mục duy nhất kết hợp để đảm bảo một chuyến bay không có các tên hạng vé trùng lặp
FareClassSchema.index({ flight: 1, className: 1 }, { unique: true });

export default mongoose.models.FareClass || mongoose.model<IFareClass>('FareClass', FareClassSchema);