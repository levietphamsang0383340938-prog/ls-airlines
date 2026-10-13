import mongoose, { Schema } from 'mongoose';

export interface IPassenger {
  fullName: string;
  dob: Date;
  passportNumber?: string; // Tùy chọn, vì không phải tất cả hành khách đều có (ví dụ: em bé)
  seatNumber?: string; // Được gán sau khi đặt vé hoặc trong quá trình check-in
  extraBaggage?: boolean;
}

export const PassengerSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  passportNumber: { type: String, unique: false, sparse: true }, // Không cần unique toàn cục, nhưng có thể unique trong ngữ cảnh một booking. Sparse cho phép giá trị null/undefined.
  seatNumber: { type: String },
  extraBaggage: { type: Boolean, default: false },
}, { _id: false }); // Không tạo _id riêng cho các tài liệu nhúng

// Không export default vì đây là một Schema nhúng, không phải một Model độc lập.