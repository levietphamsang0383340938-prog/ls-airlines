import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { bookingId, flightId } = body;

    if (!bookingId || !flightId) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ Mã đặt chỗ và Mã chuyến bay." },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({ 
      bookingId: bookingId.toUpperCase().trim(),
      flightId: flightId.toUpperCase().trim()
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Không tìm thấy vé. Vui lòng kiểm tra lại thông tin." },
        { status: 404 }
      );
    }

    if (booking.status !== "PAID") {
      return NextResponse.json(
        { message: "Vé này chưa được thanh toán thành công. Không thể đặt dịch vụ bổ trợ." },
        { status: 400 }
      );
    }

    // Nếu mọi thứ ok
    return NextResponse.json(
      { 
        message: "Xác thực thành công", 
        booking 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("LỖI XÁC THỰC VÉ:", error);
    return NextResponse.json(
      { message: "Đã có lỗi xảy ra từ máy chủ." },
      { status: 500 }
    );
  }
}
