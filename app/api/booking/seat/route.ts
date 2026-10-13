import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { bookingId, seatNumber } = body;

    if (!bookingId || !seatNumber) {
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc." },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: bookingId },
      { seatNumber: seatNumber, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { message: "Không tìm thấy mã đặt chỗ." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Lưu ghế thành công!",
        seatNumber: updatedBooking.seatNumber
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("LỖI LƯU GHẾ:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra từ máy chủ." },
      { status: 500 }
    );
  }
}
