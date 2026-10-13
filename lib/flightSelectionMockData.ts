export type Fare = {
  name: 'Phổ thông' | 'Phổ thông đặc biệt' | 'Thương gia';
  price: number;
  seatsLeft: number;
  status: 'Còn vé' | 'Hết vé';
};

export type MockFlight = {
  id: string;
  flightCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string; // Format: HH:mm
  arrivalTime: string; // Format: HH:mm
  duration: string; // Format: Xh Ym
  fares: Fare[];
};

export const mockFlights: MockFlight[] = [
  {
    id: 'VN160',
    flightCode: 'VN160',
    departureAirport: 'SGN',
    arrivalAirport: 'DAD',
    departureTime: '08:00',
    arrivalTime: '09:25',
    duration: '1h 25m',
    fares: [
      {
        name: 'Phổ thông',
        price: 1250000,
        seatsLeft: 25,
        status: 'Còn vé',
      },
      {
        name: 'Phổ thông đặc biệt',
        price: 2100000,
        seatsLeft: 8,
        status: 'Còn vé',
      },
      {
        name: 'Thương gia',
        price: 4500000,
        seatsLeft: 0,
        status: 'Hết vé',
      },
    ],
  },
  {
    id: 'VJ624',
    flightCode: 'VJ624',
    departureAirport: 'SGN',
    arrivalAirport: 'DAD',
    departureTime: '10:30',
    arrivalTime: '11:50',
    duration: '1h 20m',
    fares: [
      {
        name: 'Phổ thông',
        price: 980000,
        seatsLeft: 50,
        status: 'Còn vé',
      },
      {
        name: 'Phổ thông đặc biệt',
        price: 1850000,
        seatsLeft: 3,
        status: 'Còn vé',
      },
      {
        name: 'Thương gia',
        price: 3900000,
        seatsLeft: 2,
        status: 'Còn vé',
      },
    ],
  },
  {
    id: 'QH152',
    flightCode: 'QH152',
    departureAirport: 'SGN',
    arrivalAirport: 'DAD',
    departureTime: '14:15',
    arrivalTime: '15:40',
    duration: '1h 25m',
    fares: [
      {
        name: 'Phổ thông',
        price: 1100000,
        seatsLeft: 12,
        status: 'Còn vé',
      },
      {
        name: 'Phổ thông đặc biệt',
        price: 2050000,
        seatsLeft: 0,
        status: 'Hết vé',
      },
      {
        name: 'Thương gia',
        price: 4200000,
        seatsLeft: 5,
        status: 'Còn vé',
      },
    ],
  },
];