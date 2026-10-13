import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, amount, description } = body;

    // 2. VALIDATION
    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Dữ liệu thanh toán không hợp lệ." },
        { status: 400 }
      );
    }

    // 3. TÌM VÀ KIỂM TRA SỐ DƯ
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng." },
        { status: 404 }
      );
    }

    const currentBalance = user.walletBalance || 0;
    if (currentBalance < amount) {
      return NextResponse.json(
        { message: "Số dư ví không đủ để thanh toán." },
        { status: 400 }
      );
    }

    // 4. TRỪ TIỀN VÀ LƯU BẰNG CÁCH UPDATE TRỰC TIẾP (Tránh lỗi Validation của Mongoose với các document cũ)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: -Number(amount) } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Không thể cập nhật số dư." }, { status: 500 });
    }

    // 5. LƯU LỊCH SỬ GIAO DỊCH
    await Transaction.create({
      userId: user._id,
      type: 'PAYMENT',
      amount: Number(amount),
      description: description || 'Thanh toán dịch vụ LS Airlines',
      status: 'SUCCESS'
    });

    return NextResponse.json(
      {
        message: "Thanh toán thành công!",
        newBalance: updatedUser.walletBalance,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("LỖI CHI TIÊU:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra từ máy chủ.", error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
