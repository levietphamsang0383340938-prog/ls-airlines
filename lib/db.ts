import mongoose from 'mongoose';

// Khai báo một biến global để cache kết nối
// Điều này cần thiết trong môi trường serverless/dev của Next.js
declare global {
  var mongoose: any; // eslint-disable-line no-var
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Vui lòng định nghĩa biến môi trường MONGODB_URI trong file .env.local'
  );
}

// Lấy đối tượng cache từ biến global.
// Nếu chưa có, khởi tạo một object rỗng.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Nếu đã có kết nối trong cache, sử dụng lại nó.
  if (cached.conn) {
    console.log('🚀 Sử dụng lại kết nối database đã cache.');
    return cached.conn;
  }

  // Nếu chưa có promise kết nối, tạo một promise mới.
  // Chỉ có request đầu tiên mới thực sự tạo kết nối.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ Đã tạo kết nối database mới.');
      return mongoose;
    });
  }

  // Chờ promise kết nối hoàn tất và lưu kết nối vào cache.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;