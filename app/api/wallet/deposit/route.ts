import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: NextRequest) {
  try {
    // 1. KẾT NỐI DATABASE
    await connectDB();

    const body = await req.json();
    const { userId, amount } = body;

    // 2. VALIDATION
    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Dữ liệu nạp tiền không hợp lệ." },
        { status: 400 }
      );
    }

    // 3. TÌM VÀ CẬP NHẬT TÀI KHOẢN
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng." },
        { status: 404 }
      );
    }

    // Khởi tạo walletBalance nếu chưa có
    if (user.walletBalance === undefined) {
      user.walletBalance = 0;
    }

    // Cộng tiền
    user.walletBalance += Number(amount);
    
    // Lưu vào database
    await user.save();

    // 4. LƯU LỊCH SỬ GIAO DỊCH
    await Transaction.create({
      userId: user._id,
      type: 'DEPOSIT',
      amount: Number(amount),
      description: 'Nạp tiền vào ví LS Wallet qua VietQR',
      status: 'SUCCESS'
    });

    // 5. TRẢ VỀ KẾT QUẢ
    return NextResponse.json(
      {
        message: "Nạp tiền thành công!",
        newBalance: user.walletBalance,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("LỖI NẠP TIỀN:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra từ máy chủ." },
      { status: 500 }
    );
  }
}
