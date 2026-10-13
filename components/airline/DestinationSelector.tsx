"use client";

import { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Destination = {
  city: string;
  airport: string;
  code: string;
  region: string;
  country: string;
};

const domesticDestinations: Destination[] = [
  // Miền Bắc & Bắc Trung Bộ
  { city: "Hà Nội", airport: "Nội Bài", code: "HAN", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  { city: "Hải Phòng", airport: "Cát Bi", code: "HPH", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  { city: "Quảng Ninh", airport: "Vân Đồn", code: "VDO", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  { city: "Điện Biên", airport: "Điện Biên Phủ", code: "DIN", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  { city: "Thanh Hóa", airport: "Thọ Xuân", code: "THD", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  { city: "Nghệ An", airport: "Vinh", code: "VII", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  { city: "Quảng Bình", airport: "Đồng Hới", code: "VDH", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" },
  // Miền Trung & Tây Nguyên
  { city: "Thừa Thiên Huế", airport: "Phú Bài", code: "HUI", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Đà Nẵng", airport: "Đà Nẵng", code: "DAD", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Quảng Nam", airport: "Chu Lai", code: "VCL", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Bình Định", airport: "Phù Cát", code: "UIH", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Phú Yên", airport: "Tuy Hòa", code: "TBB", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Khánh Hòa", airport: "Cam Ranh", code: "CXR", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Gia Lai", airport: "Pleiku", code: "PXU", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Đắk Lắk", airport: "Buôn Ma Thuột", code: "BMV", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  { city: "Lâm Đồng", airport: "Liên Khương", code: "DLI", region: "Miền Trung & Tây Nguyên", country: "Việt Nam" },
  // Miền Nam & Hải đảo
  { city: "TP. Hồ Chí Minh", airport: "Tân Sơn Nhất", code: "SGN", region: "Miền Nam & Hải đảo", country: "Việt Nam" },
  { city: "Cần Thơ", airport: "Cần Thơ", code: "VCA", region: "Miền Nam & Hải đảo", country: "Việt Nam" },
  { city: "Kiên Giang (Rạch Giá)", airport: "Rạch Giá", code: "VKG", region: "Miền Nam & Hải đảo", country: "Việt Nam" },
  { city: "Kiên Giang (Phú Quốc)", airport: "Phú Quốc", code: "PQC", region: "Miền Nam & Hải đảo", country: "Việt Nam" },
  { city: "Cà Mau", airport: "Cà Mau", code: "CAH", region: "Miền Nam & Hải đảo", country: "Việt Nam" },
  { city: "Bà Rịa - Vũng Tàu", airport: "Côn Đảo", code: "VCS", region: "Miền Nam & Hải đảo", country: "Việt Nam" },
];

interface DestinationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (destination: Destination) => void;
  selectedValue?: string; // Airport code (e.g., 'SGN')
}

export function DestinationSelector({
  isOpen,
  onClose,
  onSelect,
  selectedValue,
}: DestinationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = domesticDestinations.filter((dest) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      dest.city.toLowerCase().includes(query) ||
      dest.airport.toLowerCase().includes(query) ||
      dest.code.toLowerCase().includes(query)
    );
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative flex h-full max-h-[80vh] w-full flex-col rounded-2xl bg-white shadow-2xl transition-all md:max-w-xl">
        {/* Header */}
        <div className="relative border-b border-gray-200 py-4 text-center">
          <h2 className="text-lg font-bold text-[#006079]">Chọn điểm đến</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="Đóng"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <label htmlFor="destination-search" className="sr-only">
              Tìm kiếm điểm đến
            </label>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="destination-search"
              name="destination-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-base focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20"
            />
          </div>
        </div>

        {/* Destination List */}
        <div className="flex-1 overflow-y-auto">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest) => {
              const isSelected = dest.code === selectedValue;
              return (
                <div
                  key={dest.code}
                  onClick={() => {
                    onSelect(dest);
                    onClose();
                  }}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between border-b border-gray-100 px-4 py-3 transition-colors",
                    isSelected
                      ? "bg-[#e6f0f3]"
                      : "hover:bg-[#e6f0f3]"
                  )}
                >
                  {/* Left side */}
                  <div>
                    <p
                      className={cn(
                        "text-lg font-bold text-gray-800",
                        isSelected
                          ? "text-[#006079]"
                          : "group-hover:text-[#006079]"
                      )}
                    >
                      {dest.city}
                    </p>
                    <p className="text-sm text-gray-500">{dest.country}</p>
                  </div>
                  {/* Right side */}
                  <div className="text-right">
                    <span className="inline-block rounded-full border border-[#006079] px-3 py-1 text-sm font-semibold text-[#006079]">
                      {dest.code}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      {dest.city} ({dest.code})
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-gray-500">
              <p>Không tìm thấy điểm đến phù hợp.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full border-t border-gray-200 bg-white p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-[#006079] hover:bg-gray-100">
            <MapPin className="size-4" />
            Xem tất cả khu vực
          </button>
        </div>
      </div>
    </div>
  );
}