import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const query = searchParams.get("query"); // email hoặc số điện thoại (dành cho Admin)
    const role = searchParams.get("role"); // role của người đang request

    let targetUserId = userId;
    let targetUser = null;

    // Nếu có query (Admin đang tra cứu)
    if (query) {
      if (role !== "admin") {
        return NextResponse.json({ message: "Không có quyền truy cập." }, { status: 403 });
      }

      // Tìm user theo email hoặc sđt
      targetUser = await User.findOne({
        $or: [{ email: query }, { phoneNumber: query }, { phoneAreaCode: '+84', phoneNumber: query.replace(/^0/, '') }]
      });

      if (!targetUser) {
        return NextResponse.json({ message: "Không tìm thấy khách hàng." }, { status: 404 });
      }
      
      targetUserId = targetUser._id.toString();
    } else if (userId) {
      // User bình thường tự xem của mình
      targetUser = await User.findById(userId);
    }

    if (!targetUserId || !targetUser) {
      return NextResponse.json({ message: "Không xác định được người dùng." }, { status: 400 });
    }

    // Lấy lịch sử giao dịch
    const transactions = await Transaction.find({ userId: targetUserId })
      .sort({ createdAt: -1 })
      .limit(50); // Giới hạn 50 giao dịch gần nhất

    return NextResponse.json(
      {
        message: "Thành công",
        user: {
          fullName: targetUser.fullName,
          email: targetUser.email,
          phone: targetUser.fullPhone || targetUser.phoneNumber,
          walletBalance: targetUser.walletBalance || 0
        },
        transactions
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("LỖI LẤY LỊCH SỬ:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra từ máy chủ." },
      { status: 500 }
    );
  }
}
