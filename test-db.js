require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log("Đang kiểm tra kết nối tới MongoDB...");
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error("Lỗi: Không tìm thấy biến môi trường MONGODB_URI trong file .env.local");
      return;
    }

    await mongoose.connect(uri);
    console.log("--------------------------------------------------");
    console.log("✅ CONNECTED TO MONGODB SUCCESSFULLY!");
    console.log("✅ KẾT NỐI CƠ SỞ DỮ LIỆU THÀNH CÔNG!");
    console.log("--------------------------------------------------");
    
  } catch (error) {
    console.error("❌ Kết nối thất bại:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();
