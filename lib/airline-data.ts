export type Airport = {
  code: string
  city: string
  name: string
  country: string
}

export const airports: Airport[] = [
  { code: "SGN", city: "Ho Chi Minh City", name: "Tan Son Nhat Intl", country: "Vietnam" },
  { code: "HAN", city: "Hanoi", name: "Noi Bai Intl", country: "Vietnam" },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "NRT", city: "Tokyo", name: "Narita Intl", country: "Japan" },
  { code: "ICN", city: "Seoul", name: "Incheon Intl", country: "South Korea" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },
  { code: "JFK", city: "New York", name: "John F. Kennedy Intl", country: "United States" },
]

export type Offer = {
  id: string
  city: string
  country: string
  image: string
  fromCode: string
  price: number
  tag: string
  cabin: string
}

export const offers: Offer[] = [
  {
    id: "sgn-han",
    city: "Hà Nội",
    country: "TP. Hồ Chí Minh đến Hà Nội",
    image: "/images/hanoi.png",
    fromCode: "SGN",
    price: 888181,
    tag: "Đã xem 7 phút trước",
    cabin: "Một chiều",
  },
  {
    id: "han-sgn",
    city: "TP. Hồ Chí Minh",
    country: "Hà Nội đến TP. Hồ Chí Minh",
    image: "/images/hcmc.png",
    fromCode: "HAN",
    price: 888181,
    tag: "Đã xem 6 phút trước",
    cabin: "Một chiều",
  },
  {
    id: "han-dad",
    city: "Đà Nẵng",
    country: "Hà Nội đến Đà Nẵng",
    image: "/images/danang.png",
    fromCode: "HAN",
    price: 907181,
    tag: "Đã xem 2 giờ trước",
    cabin: "Một chiều",
  },
  {
    id: "sgn-dad",
    city: "Đà Nẵng",
    country: "TP. Hồ Chí Minh đến Đà Nẵng",
    image: "/images/danang.png",
    fromCode: "SGN",
    price: 666181,
    tag: "Đã xem 53 phút trước",
    cabin: "Một chiều",
  },
]

export type FareClass = {
  name: string
  price: number
  perks: string[]
  refundable: boolean
}

export type Flight = {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  departTime: string
  arriveTime: string
  fromCode: string
  toCode: string
  durationMinutes: number
  stops: number
  stopNote?: string
  fares: FareClass[]
}

export const flights: Flight[] = [
  {
    id: "VN312",
    airline: "Azure Air",
    airlineCode: "AZ",
    flightNumber: "AZ 312",
    departTime: "06:25",
    arriveTime: "13:40",
    fromCode: "SGN",
    toCode: "NRT",
    durationMinutes: 375,
    stops: 0,
    fares: [
      { name: "Economy Classic", price: 389, refundable: false, perks: ["1 cabin bag", "Standard seat"] },
      { name: "Economy Flex", price: 489, refundable: true, perks: ["23kg checked bag", "Free changes", "Priority check-in"] },
      { name: "Business", price: 1180, refundable: true, perks: ["Lie-flat seat", "Lounge access", "2x 32kg bags"] },
    ],
  },
  {
    id: "VN618",
    airline: "Azure Air",
    airlineCode: "AZ",
    flightNumber: "AZ 618",
    departTime: "10:50",
    arriveTime: "19:35",
    fromCode: "SGN",
    toCode: "NRT",
    durationMinutes: 465,
    stops: 1,
    stopNote: "1 stop · BKK",
    fares: [
      { name: "Economy Classic", price: 342, refundable: false, perks: ["1 cabin bag", "Standard seat"] },
      { name: "Economy Flex", price: 441, refundable: true, perks: ["23kg checked bag", "Free changes", "Priority check-in"] },
      { name: "Business", price: 1020, refundable: true, perks: ["Lie-flat seat", "Lounge access", "2x 32kg bags"] },
    ],
  },
  {
    id: "VN905",
    airline: "SkyLotus",
    airlineCode: "SL",
    flightNumber: "SL 905",
    departTime: "14:15",
    arriveTime: "21:20",
    fromCode: "SGN",
    toCode: "NRT",
    durationMinutes: 365,
    stops: 0,
    fares: [
      { name: "Economy Classic", price: 415, refundable: false, perks: ["1 cabin bag", "Standard seat"] },
      { name: "Economy Flex", price: 520, refundable: true, perks: ["23kg checked bag", "Free changes", "Priority check-in"] },
      { name: "Business", price: 1290, refundable: true, perks: ["Lie-flat seat", "Lounge access", "2x 32kg bags"] },
    ],
  },
  {
    id: "VN221",
    airline: "Pacific Wings",
    airlineCode: "PW",
    flightNumber: "PW 221",
    departTime: "19:40",
    arriveTime: "07:05",
    fromCode: "SGN",
    toCode: "NRT",
    durationMinutes: 505,
    stops: 1,
    stopNote: "1 stop · ICN",
    fares: [
      { name: "Economy Classic", price: 298, refundable: false, perks: ["1 cabin bag", "Standard seat"] },
      { name: "Economy Flex", price: 388, refundable: true, perks: ["23kg checked bag", "Free changes", "Priority check-in"] },
      { name: "Business", price: 940, refundable: true, perks: ["Lie-flat seat", "Lounge access", "2x 32kg bags"] },
    ],
  },
  {
    id: "VN744",
    airline: "Azure Air",
    airlineCode: "AZ",
    flightNumber: "AZ 744",
    departTime: "22:10",
    arriveTime: "05:25",
    fromCode: "SGN",
    toCode: "NRT",
    durationMinutes: 375,
    stops: 0,
    fares: [
      { name: "Economy Classic", price: 366, refundable: false, perks: ["1 cabin bag", "Standard seat"] },
      { name: "Economy Flex", price: 466, refundable: true, perks: ["23kg checked bag", "Free changes", "Priority check-in"] },
      { name: "Business", price: 1110, refundable: true, perks: ["Lie-flat seat", "Lounge access", "2x 32kg bags"] },
    ],
  },
]

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m.toString().padStart(2, "0")}m`
}
