import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { bookingId, status } = body;

    // Validation
    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Thiếu thông tin bookingId hoặc status" },
        { status: 400 }
      );
    }

    if (!["PENDING", "PAID", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    // Tìm booking theo bookingId hoặc flightId (cho dev mode)
    const booking = await Booking.findOne({ 
      $or: [
        { bookingId: bookingId },
        { flightId: bookingId }
      ]
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Không tìm thấy đặt vé" },
        { status: 404 }
      );
    }

    // Kiểm tra nếu booking đã hết hạn
    if (booking.expiresAt < new Date() && booking.status === "PENDING") {
      // Tự động chuyển sang CANCELLED
      await Booking.findByIdAndUpdate(booking._id, { 
        status: "CANCELLED",
        updatedAt: new Date()
      });
      return NextResponse.json(
        { error: "Đặt vé đã hết hạn và bị hủy tự động" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    // [Tích hợp Giai đoạn 2] Trừ đi số ghế trống của chuyến bay trong Database SQLite
    if (status === "PAID") {
      try {
        const searchDate = new Date(updatedBooking.date);
        searchDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const flight = await prisma.flight.findFirst({
          where: {
            flightNumber: updatedBooking.flightId,
            departDateTime: {
              gte: searchDate,
              lt: nextDay
            }
          }
        });

        if (flight) {
          await prisma.flight.update({
            where: { id: flight.id },
            data: { seatsLeft: Math.max(0, flight.seatsLeft - updatedBooking.pax) }
          });
          console.log(`Đã trừ ${updatedBooking.pax} ghế cho chuyến bay ${flight.flightNumber}`);
        }
      } catch (err) {
        console.error("Lỗi khi trừ ghế chuyến bay:", err);
      }
    }

    return NextResponse.json(
      { 
        message: "Cập nhật trạng thái thành công",
        booking: updatedBooking
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("LỖI CẬP NHẬT THANH TOÁN:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ" },
      { status: 500 }
    );
  }
}

// API để tạo booking mới (khi khách hàng điền form thông tin hành khách)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      flightId,
      from,
      to,
      date,
      pax,
      pkg,
      price,
      fullName,
      dob,
      idNumber
    } = body;

    // Validation
    if (!flightId || !from || !to || !date || !fullName || !idNumber) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Tạo bookingId unique (6 ký tự chữ và số)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingId = "";
    for (let i = 0; i < 6; i++) {
      bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Tính thời gian hết hạn (current time + 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Tạo booking mới
    const newBooking = await Booking.create({
      bookingId,
      flightId,
      from,
      to,
      date,
      pax: parseInt(pax) || 1,
      pkg,
      price,
      fullName,
      dob,
      idNumber,
      status: "PENDING",
      expiresAt
    });

    return NextResponse.json(
      { 
        message: "Tạo đặt vé thành công",
        bookingId: newBooking.bookingId,
        expiresAt: newBooking.expiresAt
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("LỖI TẠO ĐẶT VÉ:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ" },
      { status: 500 }
    );
  }
}