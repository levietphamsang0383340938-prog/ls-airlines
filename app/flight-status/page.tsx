"use client"

import { use } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plane, ExternalLink, Calendar, Info, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

import { mockFlights, getCityName } from "@/lib/flights";

interface PageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    date?: string;
  }>;
}

export default function FlightStatusPage({ searchParams }: PageProps) {
  const { currentLanguage } = useLocale();
  const dateFnsLocale = currentLanguage === 'vi' ? vi : enUS;
  const params = use(searchParams);

  const from = params.from || "HAN";
  const to = params.to || "SGN";
  const dateStr = params.date || format(new Date(), "yyyy-MM-dd");
  const flightNumber = params.flightNumber;
  const dateObj = parseISO(dateStr);

  // Lọc chuyến bay theo tham số tìm kiếm
  const displayedFlights = mockFlights.filter(f => {
    if (flightNumber) {
      return f.id.replace(/\s/g, '').toLowerCase() === flightNumber.replace(/\s/g, '').toLowerCase();
    }
    return f.departAirport === from && f.arrivalAirport === to;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER */}
      <header className="bg-[#006079] text-white py-4 shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChevronLeft className="size-5" />
            <span className="font-semibold text-sm">Trang chủ</span>
          </Link>
          <h1 className="text-xl font-bold">Trạng thái chuyến bay</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Title & Route info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Trạng thái chuyến bay</h2>
          
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-4 text-[#006079] font-bold text-lg md:text-xl">
              <span>{getCityName(from)} ({from}), Việt Nam</span>
              <Plane className="size-5 transform" />
              <span>{getCityName(to)} ({to}), Việt Nam</span>
            </div>
            <div className="text-gray-500 font-medium">
              {format(dateObj, "EEEE 'Ngày' d 'tháng' M, yyyy", { locale: dateFnsLocale })}
            </div>
          </div>
        </div>

        {/* Flight List */}
        <div className="space-y-4">
          {displayedFlights.length > 0 ? (
            displayedFlights.map((flight, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Operator & Flight Num */}
                <div className="flex w-full md:w-1/4 items-center gap-3">
                  <span className="text-[#eaaa00] text-xl">🌸</span>
                  <div>
                    <p className="font-bold text-[#006079] text-lg">{flight.id}</p>
                    <p className="text-[10px] md:text-xs text-gray-500">{flight.operator}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 w-full flex items-center justify-between px-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{flight.departTime}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-1">{flight.departAirport}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-4 relative">
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-3 py-1 rounded-full border border-gray-200 relative top-2 z-10">
                      {flight.flightType}
                    </span>
                    <div className="w-full border-t border-gray-300"></div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-1">{flight.arrivalAirport}</p>
                  </div>
                </div>

                {/* Action */}
                <div className="w-full md:w-auto flex justify-end">
                  <button className="flex items-center gap-1 text-sm font-semibold text-[#006079] hover:underline whitespace-nowrap">
                    Xem chi tiết <ChevronDown className="size-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center text-gray-500">
            Không tìm thấy chuyến bay nào khớp với điều kiện tra cứu.
          </div>
        )}
        </div>

      </main>
    </div>
  );
}
