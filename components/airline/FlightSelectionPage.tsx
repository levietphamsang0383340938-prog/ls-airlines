"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Plane, Edit } from "lucide-react";
import { ProgressSteps } from "./progress-steps";
import { mockFlights, type MockFlight, type Fare } from "@/lib/flightSelectionMockData";

type SelectedFareInfo = {
  flight: MockFlight;
  fare: Fare;
};

export function FlightSelectionPage() {
  const [selectedFare, setSelectedFare] = useState<SelectedFareInfo | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read route info from URL query parameters
  const from = searchParams.get('from') || 'N/A';
  const to = searchParams.get('to') || 'N/A';
  // You can also get other params like tripType, date, etc.

  // Hàm xử lý khi người dùng chọn một hạng vé
  const handleSelectFare = (flight: MockFlight, fare: Fare) => {
    if (fare.status === 'Hết vé') {
      console.log(`Hạng vé "${fare.name}" của chuyến bay ${flight.flightCode} đã hết.`);
      return;
    }
    const selection: SelectedFareInfo = { flight, fare };
    setSelectedFare(selection);
  };

  // Sử dụng useEffect để log ra thông tin mỗi khi state `selectedFare` thay đổi
  useEffect(() => {
    if (selectedFare) {
      console.log("Người dùng đã chọn:", {
        flightCode: selectedFare.flight.flightCode,
        departure: selectedFare.flight.departureTime,
        arrival: selectedFare.flight.arrivalTime,
        fareName: selectedFare.fare.name,
        price: selectedFare.fare.price,
      });
    }
  }, [selectedFare]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Thanh tiến trình */}
      <ProgressSteps current={2} />

      {/* Header của trang: Hiển thị thông tin chuyến đi */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
              <ArrowLeft className="size-4" />
              Quay lại
            </button>
            <span className="h-5 w-px bg-gray-200" />
            <p className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Plane className="size-5 -rotate-45 text-[#006079]" />
              {from} <span className="font-normal text-gray-400">→</span> {to}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="size-4" />
              Thứ 2, 20/07/2024 {/* This can also be made dynamic */}
            </p>
          </div>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100">
            <Edit className="size-4" />
            Thay đổi
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Placeholder cho Thanh chọn ngày (DateBar) */}
        <div className="mb-8 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center text-gray-500">
          <p className="font-semibold">Placeholder cho DateBar</p>
          <p className="text-sm">Component chọn ngày sẽ được đặt ở đây.</p>
        </div>

        {/* Placeholder cho Danh sách thẻ chuyến bay (FlightCardList) */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center text-gray-500">
          <p className="font-semibold">Placeholder cho FlightCardList</p>
          <p className="text-sm">
            Danh sách các `FlightCard` sẽ được render ở đây. Mỗi card sẽ nhận dữ liệu từ `mockFlights` và gọi hàm `handleSelectFare` khi người dùng nhấp chọn.
          </p>
        </div>
      </main>
    </div>
  );
}