const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = "mongodb+srv://admin:Levietphamsang1234@cluster0.igajhss.mongodb.net/airlineApp?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function exportToCSV() {
  try {
    console.log("Đang kết nối tới cơ sở dữ liệu MongoDB...");
    await client.connect();
    const db = client.db("airlineApp");

    // 1. XUẤT DỮ LIỆU BOOKINGS
    console.log("Đang trích xuất dữ liệu Bookings...");
    const bookings = await db.collection("bookings").find({}).toArray();
    
    if (bookings.length > 0) {
      const bookingHeaders = "MaDatCho,KhachHang,ChuyenBay,TongTien,TrangThai,NgayDat\n";
      const bookingRows = bookings.map(b => {
        return `${b.bookingId || ''},"${b.fullName || ''}",${b.flightId || ''},"${b.price || ''}",${b.status || ''},${b.createdAt || ''}\n`;
      }).join("");
      
      fs.writeFileSync("DanhSachDatVe.csv", "\uFEFF" + bookingHeaders + bookingRows);
      console.log(`✅ Đã xuất thành công ${bookings.length} vé ra file DanhSachDatVe.csv`);
    } else {
      console.log("Không có dữ liệu Bookings.");
    }

    // 2. XUẤT DỮ LIỆU USERS
    console.log("Đang trích xuất dữ liệu Users...");
    const users = await db.collection("users").find({}).toArray();
    
    if (users.length > 0) {
      const userHeaders = "Email,Ho,Ten,SoDienThoai,Quyen,SoDuVi\n";
      const userRows = users.map(u => {
        return `${u.email || ''},"${u.lastName || ''}","${u.firstName || ''}",${u.phoneNumber || ''},${u.role || ''},${u.walletBalance || 0}\n`;
      }).join("");
      
      fs.writeFileSync("DanhSachNguoiDung.csv", "\uFEFF" + userHeaders + userRows);
      console.log(`✅ Đã xuất thành công ${users.length} tài khoản ra file DanhSachNguoiDung.csv`);
    } else {
      console.log("Không có dữ liệu Users.");
    }

  } catch (error) {
    console.error("Lỗi trong quá trình xuất dữ liệu:", error);
  } finally {
    await client.close();
    console.log("Đã đóng kết nối CSDL.");
  }
}

exportToCSV();
