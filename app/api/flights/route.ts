import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const dateStr = searchParams.get('date');

  try {
    let whereClause: any = {};

    // 1. Lọc theo điểm đi và đến
    if (from && to) {
      whereClause.departAirport = from;
      whereClause.arrivalAirport = to;
    }

    // 2. Lọc theo ngày và bộ lọc thời gian thực
    if (dateStr) {
      const searchDate = new Date(dateStr);
      searchDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const currentTime = new Date(); // Lấy thời gian hiện tại của Server

      whereClause.departDateTime = {
        gte: searchDate > currentTime ? searchDate : currentTime, // Phải lớn hơn hiện tại
        lt: nextDay // Trong cùng ngày
      };
    } else {
      const currentTime = new Date();
      whereClause.departDateTime = {
        gte: currentTime
      };
    }

    const flights = await prisma.flight.findMany({
      where: whereClause,
      orderBy: {
        departDateTime: 'asc'
      }
    });

    // Parse data to match frontend structure
    const formattedFlights = flights.map(flight => {
      return {
        id: flight.flightNumber,
        departTime: flight.departTime,
        departAirport: flight.departAirport,
        departTerminal: flight.departTerminal,
        arrivalTime: flight.arrivalTime,
        arrivalAirport: flight.arrivalAirport,
        arrivalTerminal: flight.arrivalTerminal,
        flightType: flight.flightType,
        duration: flight.duration,
        operator: flight.operator,
        seatsLeft: flight.seatsLeft,
        economy: {
          price: flight.ecoBase,
          packages: [
            { name: "Phổ Thông Tiêu Chuẩn", price: flight.ecoBase + " VND", badge: "Rẻ nhất", changeFee: "Phí 300k", refundFee: "Không", checkedBaggage: "1 x 23kg", carryBaggage: "10kg", miles: "50%" },
            { name: "Phổ Thông Linh Hoạt", price: flight.ecoFlex, badge: "", changeFee: "Miễn phí", refundFee: "Phí 500k", checkedBaggage: "1 x 23kg", carryBaggage: "10kg", miles: "100%" }
          ]
        },
        deluxe: {
          price: flight.deluxeBase,
          packages: [
            { name: "Phổ Thông Đặc Biệt Tiêu Chuẩn", price: flight.deluxeBase + " VND", badge: "", changeFee: "Miễn phí", refundFee: "Phí 300k", checkedBaggage: "1 x 32kg", carryBaggage: "10kg", miles: "120%" },
            { name: "Phổ Thông Đặc Biệt Linh Hoạt", price: flight.deluxeFlex, badge: "", changeFee: "Miễn phí", refundFee: "Miễn phí", checkedBaggage: "1 x 32kg", carryBaggage: "10kg", miles: "130%" }
          ]
        },
        business: {
          price: flight.busBase,
          available: true,
          packages: [
            { name: "Thương Gia Tiêu Chuẩn", price: flight.busBase + " VND", badge: "", changeFee: "Miễn phí", refundFee: "Phí 300k", checkedBaggage: "1 x 32kg", carryBaggage: "18kg", miles: "150%" },
            { name: "Thương Gia Linh Hoạt", price: flight.busFlex, badge: "VIP", changeFee: "Miễn phí", refundFee: "Miễn phí", checkedBaggage: "2 x 32kg", carryBaggage: "18kg", miles: "200%" }
          ]
        }
      }
    });

    return NextResponse.json({ success: true, data: formattedFlights });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
