import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db"; // Sử dụng helper kết nối đã tạo
import User from "@/models/User"; // Import model từ đúng vị trí

export async function POST(req: NextRequest) {
  try {
    // 1. KẾT NỐI DATABASE
    await connectDB();

    const body = await req.json();
    const loginId = (body.identifier || body.email)?.trim();
    const password = body.password;

    // 2. VALIDATION
    if (!loginId || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập email/số điện thoại và mật khẩu." },
        { status: 400 }
      );
    }

    // 3. TÌM USER VÀ LẤY MẬT KHẨU
    // Tìm user bằng email hoặc SĐT và dùng .select('+password') để lấy trường password
    const user = await User.findOne({
      $or: [{ email: loginId }, { phone: loginId }]
    }).select("+password");

    if (!user || !user.password) {
      // Trả về lỗi chung để tránh tiết lộ thông tin tài khoản nào tồn tại
      return NextResponse.json(
        { message: "Tài khoản hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    // 4. SO SÁNH MẬT KHẨU
    // Hỗ trợ cả mật khẩu đã hash và mật khẩu cũ (dạng text) để tương thích ngược
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch && password !== user.password) {
      return NextResponse.json(
        { message: "Tài khoản hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    // 5. TẠO JWT TOKEN
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in .env file. Cannot create token.");
        return NextResponse.json({ message: "Lỗi cấu hình máy chủ." }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "1d" } // Token có hiệu lực trong 1 ngày
    );

    // 6. TRẢ VỀ KẾT QUẢ THÀNH CÔNG
    // Trả về thông tin user không bao gồm mật khẩu
    const userForResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0,
      dateOfBirth: user.dateOfBirth,
      idNumber: user.idNumber || "",
      gender: user.gender,
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      displayName: user.displayName,
      nationality: user.nationality,
      language: user.language,
      idIssuePlace: user.idIssuePlace,
      idIssueDate: user.idIssueDate,
      company: user.company,
      addressDetails: user.addressDetails,
      address: user.address,
      province: user.province,
      ward: user.ward,
      postalCode: user.postalCode,
      phoneNumber: user.phoneNumber
    };

    return NextResponse.json(
      {
        message: "Đăng nhập thành công!",
        token,
        user: userForResponse
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("LỖI ĐĂNG NHẬP CHI TIẾT:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra từ máy chủ." },
      { status: 500 }
    );
  }
}