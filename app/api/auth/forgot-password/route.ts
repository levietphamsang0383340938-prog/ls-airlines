import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

// Load User model manually if not already loaded to prevent missing schema error
import '@/models/User';
const User = mongoose.models.User;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Vui lòng cung cấp email.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản với email này.' }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 15 minutes from now
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Dùng updateOne để tránh lỗi validation do dữ liệu cũ trong DB (VD: title = 'Ông' không khớp enum 'Mr')
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetPasswordOtp: otp, 
          resetPasswordExpires: expires 
        } 
      },
      { runValidators: false }
    );

    // Call local send-email API
    // Note: Since this is server-side, fetching absolute URL can be tricky if we don't know the host,
    // so we can just reuse the logic or do a fetch to origin. 
    // Usually in Next.js App router we can just import the logic or fetch absolute url.
    // For simplicity, we'll try to fetch localhost if in dev, but it's better to fetch dynamically.
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    
    await fetch(`${protocol}://${host}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'OTP',
        email: user.email,
        data: {
          fullName: user.displayName || user.lastName,
          otp: otp
        }
      })
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Mã OTP đã được gửi đến email của bạn.' 
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Đã có lỗi xảy ra. Chi tiết: ' + (error.message || error.toString()) }, { status: 500 });
  }
}
