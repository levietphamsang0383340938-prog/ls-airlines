import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    // 1. KẾT NỐI DATABASE
    await connectDB();

    // 2. LẤY THÔNG TIN TỪ REQUEST
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // 3. VALIDATION INPUT
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới" },
        { status: 400 }
      );
    }

    // 4. XÁC THỰC USER TỪ TOKEN
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in .env file");
      return NextResponse.json(
        { error: "Lỗi cấu hình máy chủ" },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 401 }
      );
    }

    // 5. TÌM USER TRONG DATABASE
    const user = await User.findById(decoded.userId).select("+password");
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // 6. KIỂM TRA MẬT KHẨU HIỆN TẠI
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Mật khẩu hiện tại không chính xác" },
        { status: 400 }
      );
    }

    // 7. MÃ HÓA MẬT KHẨU MỚI
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 8. CẬP NHẬT MẬT KHẨU TRONG DATABASE
    await User.findByIdAndUpdate(decoded.userId, {
      password: hashedNewPassword
    });

    // 9. TRẢ VỀ KẾT QUẢ THÀNH CÔNG
    return NextResponse.json(
      { message: "Đổi mật khẩu thành công" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("LỖI ĐỔI MẬT KHẨU CHI TIẾT:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ" },
      { status: 500 }
    );
  }
}