export interface FlightPackage {
  name: string;
  price: string;
  badge: string;
  changeFee: string;
  refundFee: string;
  checkedBaggage: string;
  carryBaggage: string;
  miles: string;
  isWarning?: boolean;
}

export interface FlightClass {
  price: string;
  available?: boolean;
  packages: FlightPackage[];
}

export interface Flight {
  id: string;
  departTime: string;
  departAirport: string;
  departTerminal: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  flightType: string;
  duration: string;
  operator: string;
  seatsLeft: number;
  economy: FlightClass;
  deluxe: FlightClass;
  business: FlightClass;
}

const generateMockFlights = (): Flight[] => {
  const flights: Flight[] = [];
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

  let idCounter = 100;
  
  // Sử dụng hàm sinh số ngẫu nhiên cố định (seeded PRNG) để tránh lỗi Hydration mismatch giữa Server/Client
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  routes.forEach(route => {
    // Tạo 5 - 12 chuyến mỗi chặng
    const numFlights = Math.floor(random() * 8) + 5;
    for (let i = 0; i < numFlights; i++) {
      const departHour = 5 + i * Math.floor(18 / numFlights);
      const departMinute = random() > 0.5 ? "00" : "30";
      const departTime = `${departHour.toString().padStart(2, '0')}:${departMinute}`;
      
      const [durH, durM] = route.duration.split("h ");
      const totalDurMin = parseInt(durH) * 60 + parseInt(durM.replace('phút', ''));
      const totalDepMin = departHour * 60 + parseInt(departMinute);
      const totalArrMin = totalDepMin + totalDurMin;
      const arrHour = Math.floor(totalArrMin / 60) % 24;
      const arrMinute = totalArrMin % 60;
      const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMinute.toString().padStart(2, '0')}`;

      const operatorId = random();
      const operatorName = operatorId > 0.7 ? "LS Airlines" : (operatorId > 0.3 ? "Vietnam Airlines" : "Vietjet Air");
      const flightCode = operatorName === "Vietjet Air" ? "VJ" : "VN";
      idCounter++;

      const basePrice = Math.floor((route.distance * 1500 + random() * 500000) / 1000) * 1000;
      const fmtPrice = (p: number) => p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
      const fmtPriceNoVnd = (p: number) => p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      const ecoBase = basePrice;
      const ecoFlex = basePrice + 500000;
      const deluxeBase = basePrice + 1000000;
      const deluxeFlex = basePrice + 1800000;
      const busBase = basePrice + 3000000;
      const busFlex = basePrice + 5000000;

      flights.push({
        id: `${flightCode} ${idCounter}`,
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
        economy: {
          price: fmtPriceNoVnd(ecoBase),
          packages: [
            { name: "Phổ Thông Tiêu Chuẩn", price: fmtPrice(ecoBase), badge: "Rẻ nhất", changeFee: "Phí 300k", refundFee: "Không", checkedBaggage: "1 x 23kg", carryBaggage: "10kg", miles: "50%" },
            { name: "Phổ Thông Linh Hoạt", price: fmtPrice(ecoFlex), badge: "", changeFee: "Miễn phí", refundFee: "Phí 500k", checkedBaggage: "1 x 23kg", carryBaggage: "10kg", miles: "100%" }
          ]
        },
        deluxe: {
          price: fmtPriceNoVnd(deluxeBase),
          packages: [
            { name: "Phổ Thông Đặc Biệt Tiêu Chuẩn", price: fmtPrice(deluxeBase), badge: "", changeFee: "Miễn phí", refundFee: "Phí 300k", checkedBaggage: "1 x 32kg", carryBaggage: "10kg", miles: "120%" },
            { name: "Phổ Thông Đặc Biệt Linh Hoạt", price: fmtPrice(deluxeFlex), badge: "", changeFee: "Miễn phí", refundFee: "Miễn phí", checkedBaggage: "1 x 32kg", carryBaggage: "10kg", miles: "130%" }
          ]
        },
        business: {
          price: fmtPriceNoVnd(busBase),
          available: true,
          packages: [
            { name: "Thương Gia Tiêu Chuẩn", price: fmtPrice(busBase), badge: "", changeFee: "Miễn phí", refundFee: "Phí 300k", checkedBaggage: "1 x 32kg", carryBaggage: "18kg", miles: "150%" },
            { name: "Thương Gia Linh Hoạt", price: fmtPrice(busFlex), badge: "VIP", changeFee: "Miễn phí", refundFee: "Miễn phí", checkedBaggage: "2 x 32kg", carryBaggage: "18kg", miles: "200%" }
          ]
        }
      });
    }
  });

  return flights;
};

export const mockFlights = generateMockFlights();

export const getCityName = (code: string) => {
  switch (code.toUpperCase()) {
    case "SGN": return "Tp. Hồ Chí Minh";
    case "DAD": return "Đà Nẵng";
    case "HAN": return "Hà Nội";
    case "HPH": return "Hải Phòng";
    case "VCA": return "Cần Thơ";
    case "PQC": return "Phú Quốc";
    case "CXR": return "Nha Trang";
    case "VDO": return "Vân Đồn";
    default: return code;
  }
};
