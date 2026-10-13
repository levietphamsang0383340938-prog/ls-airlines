import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 1. Xóa các chuyến bay cũ hơn 7 ngày
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deleteResult = await prisma.flight.deleteMany({
      where: {
        departDateTime: {
          lt: sevenDaysAgo
        }
      }
    });

    // 2. Tạo chuyến bay cho ngày thứ 30 trong tương lai
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + 30);

    // Kiểm tra xem ngày này đã có dữ liệu chưa để tránh duplicate
    const existingFlights = await prisma.flight.count({
      where: {
        departDateTime: {
          gte: targetDate,
          lt: new Date(new Date(targetDate).setDate(targetDate.getDate() + 1))
        }
      }
    });

    let newFlightsCount = 0;
    if (existingFlights === 0) {
      const routes = [
        { from: "HAN", to: "SGN", duration: "2h 10phút", distance: 1160 },
        { from: "SGN", to: "HAN", duration: "2h 10phút", distance: 1160 },
        { from: "HAN", to: "DAD", duration: "1h 25phút", distance: 630 },
        { from: "DAD", to: "HAN", duration: "1h 25phút", distance: 630 },
        { from: "SGN", to: "DAD", duration: "1h 25phút", distance: 600 },
        { from: "DAD", to: "SGN", duration: "1h 25phút", distance: 600 },
        { from: "SGN", to: "PQC", duration: "1h 05phút", distance: 300 },
        { from: "PQC", to: "SGN", duration: "1h 05phút", distance: 300 },
        { from: "HAN", to: "PQC", duration: "2h 15phút", distance: 1200 },
        { from: "PQC", to: "HAN", duration: "2h 15phút", distance: 1200 },
        { from: "HAN", to: "HPH", duration: "1h 00phút", distance: 100 },
        { from: "HPH", to: "HAN", duration: "1h 00phút", distance: 100 },
      ];

      // Tìm id lớn nhất hiện tại để tiếp tục đếm
      const lastFlight = await prisma.flight.findFirst({
        orderBy: { id: 'desc' }
      });
      
      let idCounter = lastFlight ? parseInt(lastFlight.flightNumber.split(" ")[1]) || 9999 : 9999;

      let seed = targetDate.getTime();
      const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      const fmtPriceNoVnd = (p: number) => p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const fmtPrice = (p: number) => fmtPriceNoVnd(p) + " VND";

      for (const route of routes) {
        const numFlights = Math.floor(random() * 6) + 4;
        for (let i = 0; i < numFlights; i++) {
          const departHour = 5 + i * Math.floor(18 / numFlights);
          const departMinute = random() > 0.5 ? 0 : 30;
          
          const departDateTime = new Date(targetDate);
          departDateTime.setHours(departHour, departMinute, 0, 0);

          const departTime = `${departHour.toString().padStart(2, '0')}:${departMinute.toString().padStart(2, '0')}`;
          
          const [durH, durM] = route.duration.split("h ");
          const totalDurMin = parseInt(durH) * 60 + parseInt(durM.replace('phút', ''));
          const totalDepMin = departHour * 60 + departMinute;
          const totalArrMin = totalDepMin + totalDurMin;
          const arrHour = Math.floor(totalArrMin / 60) % 24;
          const arrMinute = totalArrMin % 60;
          const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMinute.toString().padStart(2, '0')}`;

          const operatorId = random();
          const operatorName = operatorId > 0.7 ? "LS Airlines" : (operatorId > 0.3 ? "Vietnam Airlines" : "Vietjet Air");
          const flightCode = operatorName === "Vietjet Air" ? "VJ" : "VN";
          idCounter++;

          const basePrice = Math.floor((route.distance * 1500 + random() * 500000) / 1000) * 1000;

          await prisma.flight.create({
            data: {
              flightNumber: `${flightCode} ${idCounter}`,
              departTime,
              departAirport: route.from,
              departTerminal: "Nhà ga 1",
              arrivalTime,
              arrivalAirport: route.to,
              arrivalTerminal: "Nhà ga 1",
              flightType: "Bay thẳng",
              duration: route.duration,
              operator: `Khai thác bởi ${operatorName}`,
              seatsLeft: Math.floor(random() * 20) + 1,
              ecoBase: fmtPriceNoVnd(basePrice),
              ecoFlex: fmtPrice(basePrice + 500000),
              deluxeBase: fmtPriceNoVnd(basePrice + 1000000),
              deluxeFlex: fmtPrice(basePrice + 1800000),
              busBase: fmtPriceNoVnd(basePrice + 3000000),
              busFlex: fmtPrice(basePrice + 5000000),
              departDateTime: departDateTime
            }
          });
          newFlightsCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      deletedOldFlights: deleteResult.count,
      generatedNewFlights: newFlightsCount,
      targetDateGenerated: targetDate.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
