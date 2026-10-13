import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import BookingHistory from "@/models/BookingHistory";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { bookingId, reason, refundAmount } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp mã đặt chỗ (bookingId)" },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      $or: [
        { bookingId: bookingId },
        { flightId: bookingId }
      ]
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Không tìm thấy thông tin đặt vé này" },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Vé này đã được hủy trước đó" },
        { status: 400 }
      );
    }

    // Xử lý Hủy theo trạng thái thanh toán
    if (booking.status === "PENDING") {
      // Chưa thanh toán -> Hủy trực tiếp
      booking.status = "CANCELLED";
      booking.updatedAt = new Date();
      await booking.save();

      // Lưu lịch sử
      await BookingHistory.create({
        bookingId: booking.bookingId,
        flightId: booking.flightId,
        fullName: booking.fullName,
        action: "CANCELLED_BY_USER",
        reason: reason || "Hủy vé chưa thanh toán",
        price: booking.price,
        refundAmount: "0 VND"
      });

      return NextResponse.json(
        { 
          message: "Hủy đặt vé thành công.",
          booking 
        },
        { status: 200 }
      );
    } 
    
    if (booking.status === "PAID") {
      // Đã thanh toán -> Xét hạng vé (pkg)
      const isPromo = booking.pkg.toLowerCase().includes("khuyến mãi") || booking.pkg.toLowerCase().includes("promo");
      
      if (isPromo) {
        return NextResponse.json(
          { error: "Vé Khuyến mãi không được phép hủy hoặc hoàn tiền." },
          { status: 400 }
        );
      }

      // Các hạng vé khác được phép hủy và hoàn tiền
      booking.status = "REFUND_PENDING";
      booking.updatedAt = new Date();
      await booking.save();

      // Lưu lịch sử
      await BookingHistory.create({
        bookingId: booking.bookingId,
        flightId: booking.flightId,
        fullName: booking.fullName,
        action: "CANCELLED_BY_USER",
        reason: reason || "Yêu cầu hoàn tiền",
        price: booking.price,
        refundAmount: refundAmount || "Đang tính toán"
      });

      return NextResponse.json(
        { 
          message: "Yêu cầu hủy vé thành công. Số tiền sẽ được hoàn lại (sau khi trừ phí) trong vòng 7-14 ngày làm việc.",
          booking 
        },
        { status: 200 }
      );
    }

    // Fallback
    return NextResponse.json(
      { error: "Trạng thái vé không hợp lệ để hủy" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("LỖI HỦY VÉ:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ" },
      { status: 500 }
    );
  }
}
