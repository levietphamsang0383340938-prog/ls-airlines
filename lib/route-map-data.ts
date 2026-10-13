export type MapAirport = {
  iata: string;
  city: string;
  coordinates: [number, number];
};

export const mapAirports: MapAirport[] = [
  { iata: "HAN", city: "Hà Nội", coordinates: [21.2212, 105.8072] },
  { iata: "SGN", city: "TP. Hồ Chí Minh", coordinates: [10.8185, 106.6518] },
  { iata: "DAD", city: "Đà Nẵng", coordinates: [16.0439, 108.1994] },
  { iata: "CXR", city: "Nha Trang", coordinates: [11.9981, 109.2194] },
  { iata: "DLI", city: "Đà Lạt", coordinates: [11.7506, 108.3739] },
  { iata: "PQC", city: "Phú Quốc", coordinates: [10.1698, 103.9986] },
  { iata: "HPH", city: "Hải Phòng", coordinates: [20.8192, 106.7247] },
  { iata: "VDO", city: "Vân Đồn", coordinates: [21.1172, 107.4144] },
  { iata: "VII", city: "Vinh", coordinates: [18.7375, 105.6706] },
  { iata: "HUI", city: "Huế", coordinates: [16.4008, 107.7036] },
  { iata: "UIH", city: "Quy Nhơn", coordinates: [13.9553, 109.0422] },
  { iata: "BMV", city: "Buôn Ma Thuột", coordinates: [12.6681, 108.1203] },
  { iata: "PXU", city: "Pleiku", coordinates: [14.0044, 108.0169] },
  { iata: "VDH", city: "Đồng Hới", coordinates: [17.5150, 106.5906] },
  { iata: "THD", city: "Thanh Hóa", coordinates: [19.9011, 105.4678] },
  { iata: "DIN", city: "Điện Biên Phủ", coordinates: [21.3972, 103.0078] },
  { iata: "VCL", city: "Chu Lai", coordinates: [15.4061, 108.7056] },
  { iata: "TBB", city: "Tuy Hòa", coordinates: [13.0500, 109.3339] },
  { iata: "VCA", city: "Cần Thơ", coordinates: [10.0850, 105.7119] },
  { iata: "VKG", city: "Rạch Giá", coordinates: [9.9597, 105.1342] },
  { iata: "CAH", city: "Cà Mau", coordinates: [9.1764, 105.1783] },
  { iata: "VCS", city: "Côn Đảo", coordinates: [8.7328, 106.6328] },
];

export type MapFlight = {
  id: string;
  from: string;
  to: string;
  airline: string;
  flightNumber: string;
  departTime: string;
  arriveTime: string;
  price: number;
  schedule: string;
};

export const generateFlights = (from: string, to: string): MapFlight[] => {
  const flights: MapFlight[] = [];
  const basePrices = [1200000, 1500000, 850000, 2100000, 950000, 1100000];
  const schedules = [
    "Thứ 2, 4, 6", 
    "Thứ 3, 5, 7", 
    "Thứ 2, 3, 4, 5, 6, 7, CN", 
    "Thứ 7, CN", 
    "Thứ 2, 6, CN",
    "Thứ 4, 5, 6"
  ];
  
  for (let i = 1; i <= 10; i++) {
    // Generate deterministic times based on from/to and i
    const hour = (5 + i * 2 + from.charCodeAt(0) % 3) % 24;
    const min = (i * 15 + from.charCodeAt(1)) % 60;
    const durHour = 1 + (to.charCodeAt(0) % 2);
    const durMin = 10 + (to.charCodeAt(1) % 40);
    
    let arrHour = hour + durHour;
    let arrMin = min + durMin;
    if (arrMin >= 60) {
      arrHour++;
      arrMin -= 60;
    }
    arrHour = arrHour % 24;
    
    flights.push({
      id: `${from}-${to}-${i}`,
      from,
      to,
      airline: "LS Airlines",
      flightNumber: `LS${1000 + i * 10 + from.charCodeAt(0)}`,
      departTime: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
      arriveTime: `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`,
      price: basePrices[(i + from.charCodeAt(0) + to.charCodeAt(1)) % basePrices.length] + (i * 50000),
      schedule: schedules[(i + to.charCodeAt(0)) % schedules.length]
    });
  }
  
  // Sort flights by departure time
  return flights.sort((a, b) => a.departTime.localeCompare(b.departTime));
};
