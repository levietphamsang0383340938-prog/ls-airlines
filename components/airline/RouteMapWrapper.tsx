"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import { Plane, ArrowRight, Search, MapPin, ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { mapAirports, generateFlights } from "@/lib/route-map-data";

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(
  () => import("@/components/airline/MapComponent"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <Plane className="h-8 w-8 animate-bounce text-[#1d4ed8]" />
          <p className="text-sm font-medium text-gray-500">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }
);

export function RouteMapWrapper() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  // Filter/Generate flights
  const availableFlights = isSearched && from && to ? generateFlights(from, to) : [];

  const handleAirportSelect = (iata: string) => {
    setIsSearched(false);
    if (!from) {
      setFrom(iata);
    } else if (!to && iata !== from) {
      setTo(iata);
    } else if (from && to) {
      // If both are filled, reset and start over with 'from'
      setFrom(iata);
      setTo("");
    }
  };

  const handleSearch = () => {
    if (from && to) {
      setIsSearched(true);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setIsSearched(false);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen w-full flex-col lg:flex-row">
      {/* Sidebar: Filters & Results */}
      <div className="flex w-full flex-col border-r border-gray-200 bg-white lg:w-[380px] lg:h-full z-20 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#1d4ed8] mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Mạng đường bay
          </h2>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Điểm đi</label>
              <select 
                value={from}
                onChange={(e) => { setFrom(e.target.value); setIsSearched(false); }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8]"
              >
                <option value="">Chọn điểm đi...</option>
                {mapAirports.map(a => (
                  <option key={a.iata} value={a.iata}>{a.city} ({a.iata})</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <button 
                onClick={handleSwap}
                disabled={!from && !to}
                className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-[#1d4ed8] disabled:opacity-50"
                title="Đảo chiều bay"
              >
                <ArrowDownUp className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Điểm đến</label>
              <select 
                value={to}
                onChange={(e) => { setTo(e.target.value); setIsSearched(false); }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#1d4ed8] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8]"
              >
                <option value="">Chọn điểm đến...</option>
                {mapAirports.map(a => (
                  <option key={a.iata} value={a.iata} disabled={a.iata === from}>{a.city} ({a.iata})</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleSearch}
              disabled={!from || !to}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#1d4ed8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
              Tìm chuyến bay
            </button>
          </div>
        </div>

        {/* Flight Results */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {isSearched && (
            <div>
              <h3 className="mb-4 text-sm font-bold text-gray-700">Chuyến bay khả dụng ({availableFlights.length})</h3>
              {availableFlights.length > 0 ? (
                <div className="space-y-4">
                  {availableFlights.map(flight => (
                    <div key={flight.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-[#1d4ed8] bg-[#e6f0f3] px-2 py-1 rounded">{flight.airline}</span>
                        <span className="text-xs font-medium text-gray-500">{flight.flightNumber}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{flight.departTime}</p>
                          <p className="text-xs text-gray-500">{flight.from}</p>
                        </div>
                        <div className="flex-1 px-4 flex flex-col items-center">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <div className="w-full border-t border-dashed border-gray-300 mt-1"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800">{flight.arriveTime}</p>
                          <p className="text-xs text-gray-500">{flight.to}</p>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <p className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 inline-block">
                          <span className="font-semibold text-gray-600">Lịch bay:</span> {flight.schedule}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <p className="text-sm font-bold text-[#da251d]">
                          {flight.price.toLocaleString('vi-VN')} VND
                        </p>
                        <Link 
                          href={`/passenger?flightId=${flight.flightNumber}&from=${flight.from}&to=${flight.to}&date=2026-09-07&pax=1&package=Phổ+Thông+Linh+Hoạt&price=${flight.price.toLocaleString('vi-VN')}+VND`}
                          className="rounded bg-yellow-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-yellow-600 inline-block"
                        >
                          Đặt vé
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                  <p className="text-sm text-gray-500">Không tìm thấy chuyến bay thẳng cho chặng này.</p>
                </div>
              )}
            </div>
          )}
          {!isSearched && (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
              <MapPin className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">Chọn điểm đi và điểm đến trên bản đồ<br/>hoặc sử dụng bộ lọc bên trên.</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative z-10 lg:h-full min-h-[400px]">
        <MapComponent 
          airports={mapAirports} 
          selectedFrom={from} 
          selectedTo={to} 
          onAirportSelect={handleAirportSelect} 
        />
      </div>
    </div>
  );
}
