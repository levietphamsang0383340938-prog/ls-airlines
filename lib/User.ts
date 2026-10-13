import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string; // `select: false` nên sẽ không có trong kết quả query mặc định
  fullName: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: [true, 'Vui lòng cung cấp email.'], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Vui lòng cung cấp một địa chỉ email hợp lệ.']
  },
  fullName: { 
    type: String, 
    required: [true, 'Vui lòng cung cấp họ và tên.'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Vui lòng cung cấp mật khẩu.'],
    select: false, // Quan trọng: không trả về mật khẩu trong các query mặc định
  },
  phone: { 
    type: String, 
    required: [true, 'Vui lòng cung cấp số điện thoại.'], 
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { 
  timestamps: true // Tự động thêm 2 trường createdAt và updatedAt
});

// Sử dụng mongoose.models.User để tránh lỗi "OverwriteModelError" khi hot-reloading trong Next.js
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);