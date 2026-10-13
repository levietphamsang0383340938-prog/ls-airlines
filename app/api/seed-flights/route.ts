import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Flight from "@/models/Flight";

const ROUTES = [
  { from: "HAN", to: "HPH", basePrice: 2497181, prefix: "VN7" },
  { from: "HAN", to: "SGN", basePrice: 3200000, prefix: "VN2" },
  { from: "SGN", to: "DAD", basePrice: 1800000, prefix: "VN1" }
];

const FLIGHT_HOURS = [5, 10, 15]; // 05:00, 10:00, 15:00

// Các ngày lễ cố định (Dương lịch năm 2026)
const HOLIDAYS = [
  new Date(2026, 0, 1),   // 1/1 (Tết Dương lịch)
  new Date(2026, 3, 30),  // 30/4
  new Date(2026, 4, 1),   // 1/5
  new Date(2026, 8, 2),   // 2/9 (Tháng 8 = September trong JS Date)
];

// Hàm kiểm tra xem 1 ngày có phải Lễ hoặc cận Lễ (±2 ngày) không
function isHolidayPeriod(date: Date): boolean {
  for (const holiday of HOLIDAYS) {
    // Tính khoảng cách giữa 2 ngày tính bằng milli-giây
    const diffTime = Math.abs(date.getTime() - holiday.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) {
      return true;
    }
  }
  return false;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Tùy chọn: Xóa dữ liệu cũ nếu muốn chạy lại từ đầu
    await Flight.deleteMany({});

    const flightsToInsert = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let flightCounter = 100;

    // Lặp 30 ngày tới
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const isHoliday = isHolidayPeriod(currentDate);

      // Lặp qua từng chặng bay
      for (const route of ROUTES) {
        
        // Lặp qua từng khung giờ
        for (const hour of FLIGHT_HOURS) {
          const departureTime = new Date(currentDate);
          departureTime.setHours(hour, 0, 0, 0);

          // Giả sử bay mất 2 tiếng
          const arrivalTime = new Date(departureTime);
          arrivalTime.setHours(hour + 2, 0, 0, 0);

          // Tăng 30% giá vé nếu là dịp lễ
          const calculatedPrice = isHoliday 
            ? Math.round(route.basePrice * 1.3) 
            : route.basePrice;

          flightsToInsert.push({
            flightId: `${route.prefix}${flightCounter}`,
            from: route.from,
            to: route.to,
            departureTime,
            arrivalTime,
            basePrice: route.basePrice,
            calculatedPrice,
            availableSeats: 200,
          });

          flightCounter++;
        }
      }
    }

    // Lưu hàng loạt vào DB
    await Flight.insertMany(flightsToInsert);

    return NextResponse.json(
      { 
        message: "Seeding thành công!", 
        totalFlightsGenerated: flightsToInsert.length 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("LỖI SEEDING FLIGHTS:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ" },
      { status: 500 }
    );
  }
}
