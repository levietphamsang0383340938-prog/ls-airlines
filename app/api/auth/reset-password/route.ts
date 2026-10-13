import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import '@/models/User';
const User = mongoose.models.User;

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn.' }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user bằng updateOne để bỏ qua validation lỗi trên schema cũ
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetPasswordOtp: "", resetPasswordExpires: "" }
      },
      { runValidators: false }
    );

    // Optionally send an email confirming password change
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    
    await fetch(`${protocol}://${host}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'CHANGE_PASSWORD',
        email: user.email,
        data: {
          fullName: user.displayName || user.lastName
        }
      })
    }).catch(e => console.error("Could not send confirmation email", e));

    return NextResponse.json({ 
      success: true, 
      message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.' 
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
