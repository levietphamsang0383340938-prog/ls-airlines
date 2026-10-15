"use client";

import { useState, useMemo, useEffect } from "react";
import { Armchair, Info, ArrowRight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Cấu hình ghế
const ROWS = 15;
const COLS = ["A", "B", "C", "D", "E", "F"];

// Các ghế đã có người đặt (hardcoded để demo)
const BOOKED_SEATS = ["1A", "1B", "2D", "3F", "7A", "7F", "8B", "8C", "10E", "12D", "14A", "15F"];

type SeatType = "FRONT" | "EXIT" | "STANDARD";

export default function SeatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdQuery = searchParams.get("bookingId");
  
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [passengerName, setPassengerName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra nếu không có mã booking trên URL -> Đá về cửa ải
    if (!bookingIdQuery) {
      router.replace("/services/seat/auth");
      return;
    }

    // 2. Lấy thông tin hành khách từ localStorage (do trang auth lưu lại)
    const verifiedData = localStorage.getItem("verified_booking");
    if (verifiedData) {
      try {
        const parsed = JSON.parse(verifiedData);
        // Kiểm tra xem data lưu trong local có khớp mã URL không (tránh lấy nhầm của người khác)
        if (parsed.bookingId === bookingIdQuery) {
          setPassengerName(parsed.fullName);
        }
      } catch (e) {}
    }
  }, [bookingIdQuery, router]);

  // Hàm xác định loại ghế dựa vào số hàng
  const getSeatType = (row: number): SeatType => {
    if (row >= 1 && row <= 3) return "FRONT";
    if (row === 7 || row === 8) return "EXIT";
    return "STANDARD";
  };

  // Giá cho từng loại ghế
  const getSeatPrice = (type: SeatType): number => {
    switch (type) {
      case "FRONT": return 120000;
      case "EXIT": return 80000;
      case "STANDARD": return 0;
    }
  };

  const getSeatLabel = (type: SeatType): string => {
    switch (type) {
      case "FRONT": return "Ghế hàng đầu";
      case "EXIT": return "Để chân rộng (Lối thoát hiểm)";
      case "STANDARD": return "Ghế tiêu chuẩn";
    }
  };

  const getSeatColorClass = (row: number, col: string) => {
    const seatId = `${row}${col}`;
    if (BOOKED_SEATS.includes(seatId)) return "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300";
    if (selectedSeat === seatId) return "bg-[#1d4ed8] text-white border-[#1d4ed8] shadow-md scale-110 z-10";
    
    const type = getSeatType(row);
    switch (type) {
      case "FRONT": return "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200";
      case "EXIT": return "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200";
      case "STANDARD": return "bg-white border-blue-200 text-[#1d4ed8] hover:bg-blue-50";
    }
  };

  const handleSeatClick = (row: number, col: string) => {
    const seatId = `${row}${col}`;
    if (BOOKED_SEATS.includes(seatId)) return; // Không cho click ghế đã đặt
    setSelectedSeat(seatId === selectedSeat ? null : seatId); // Bấm lại thì hủy chọn
  };

  // Lấy thông tin ghế đang chọn
  const selectedSeatInfo = useMemo(() => {
    if (!selectedSeat) return null;
    const rowMatch = selectedSeat.match(/\d+/);
    const colMatch = selectedSeat.match(/[A-Z]/);
    if (!rowMatch || !colMatch) return null;

    const row = parseInt(rowMatch[0]);
    const col = colMatch[0];
    const type = getSeatType(row);
    const price = getSeatPrice(type);
    
    // Tính toán loại chỗ (Cửa sổ, Lối đi, Giữa)
    let position = "Ghế giữa";
    if (col === "A" || col === "F") position = "Ghế cửa sổ";
    if (col === "C" || col === "D") position = "Ghế lối đi";

    return { id: selectedSeat, type, price, position, label: getSeatLabel(type) };
  }, [selectedSeat]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1d4ed8] mb-2 flex items-center gap-3">
            <Armchair className="h-8 w-8" />
            Chọn trước chỗ ngồi
          </h1>
          <p className="text-gray-600">Lựa chọn vị trí ngồi yêu thích cho chuyến bay thoải mái nhất.</p>
          
          {passengerName && (
            <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl inline-flex items-center gap-3 shadow-sm">
              <div className="bg-[#1d4ed8] p-2 rounded-full text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang chọn ghế cho hành khách:</p>
                <p className="font-bold text-gray-900">{passengerName} <span className="text-gray-400 font-normal ml-1">(Mã vé: {bookingIdQuery})</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: Bản đồ ghế */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              
              {/* Thân máy bay */}
              <div className="max-w-[400px] mx-auto bg-gray-100 rounded-[60px] p-4 md:p-8 relative overflow-hidden shadow-inner border-4 border-gray-200">
                
                {/* Lưới ghế */}
                <div className="flex flex-col gap-4 relative z-10">
                  {/* Cột tiêu đề A B C - D E F */}
                  <div className="flex text-center text-sm font-bold text-gray-500 mb-2">
                    <div className="flex-1 flex justify-around">
                      <span className="w-8">A</span>
                      <span className="w-8">B</span>
                      <span className="w-8">C</span>
                    </div>
                    <div className="w-8 flex-shrink-0"></div> {/* Lối đi */}
                    <div className="flex-1 flex justify-around">
                      <span className="w-8">D</span>
                      <span className="w-8">E</span>
                      <span className="w-8">F</span>
                    </div>
                  </div>

                  {/* Các hàng ghế */}
                  {Array.from({ length: ROWS }).map((_, rowIndex) => {
                    const row = rowIndex + 1;
                    return (
                      <div key={row} className="flex items-center gap-2">
                        {/* Nhóm A-B-C */}
                        <div className="flex-1 flex justify-around gap-1">
                          {COLS.slice(0, 3).map((col) => (
                            <button
                              key={`${row}${col}`}
                              onClick={() => handleSeatClick(row, col)}
                              disabled={BOOKED_SEATS.includes(`${row}${col}`)}
                              className={cn(
                                "relative w-10 h-10 md:w-12 md:h-12 rounded-t-xl rounded-b-md border-2 transition-all flex items-center justify-center font-semibold text-xs md:text-sm",
                                getSeatColorClass(row, col)
                              )}
                              title={`Ghế ${row}${col}`}
                            >
                              {selectedSeat === `${row}${col}` ? <CheckIcon /> : BOOKED_SEATS.includes(`${row}${col}`) ? <XIcon /> : `${row}${col}`}
                            </button>
                          ))}
                        </div>

                        {/* Số Hàng / Lối đi */}
                        <div className="w-6 md:w-8 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">
                          {row}
                        </div>

                        {/* Nhóm D-E-F */}
                        <div className="flex-1 flex justify-around gap-1">
                          {COLS.slice(3, 6).map((col) => (
                            <button
                              key={`${row}${col}`}
                              onClick={() => handleSeatClick(row, col)}
                              disabled={BOOKED_SEATS.includes(`${row}${col}`)}
                              className={cn(
                                "relative w-10 h-10 md:w-12 md:h-12 rounded-t-xl rounded-b-md border-2 transition-all flex items-center justify-center font-semibold text-xs md:text-sm",
                                getSeatColorClass(row, col)
                              )}
                              title={`Ghế ${row}${col}`}
                            >
                              {selectedSeat === `${row}${col}` ? <CheckIcon /> : BOOKED_SEATS.includes(`${row}${col}`) ? <XIcon /> : `${row}${col}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Chú thích & Tóm tắt */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            
            {/* Chú thích (Legend) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Chú thích</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-blue-200 bg-white"></div>
                    <span className="text-sm font-medium">Ghế tiêu chuẩn</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500">Miễn phí</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-orange-300 bg-orange-100"></div>
                    <span className="text-sm font-medium">Để chân rộng</span>
                  </div>
                  <span className="text-sm font-bold text-[#da251d]">+80.000đ</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-purple-300 bg-purple-100"></div>
                    <span className="text-sm font-medium">Ghế hàng đầu</span>
                  </div>
                  <span className="text-sm font-bold text-[#da251d]">+120.000đ</span>
                </div>

                <hr className="border-gray-100" />
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border-2 border-[#1d4ed8] bg-[#1d4ed8] flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border-2 border-gray-300 bg-gray-200 flex items-center justify-center text-gray-400">
                      <XIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Đã bán</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tóm tắt ghế đã chọn */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm tắt lựa chọn</h3>
              
              {selectedSeatInfo ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                    <div className="bg-[#1d4ed8] text-white rounded-lg p-3 font-bold text-xl min-w-[60px] text-center">
                      {selectedSeatInfo.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1d4ed8]">{selectedSeatInfo.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedSeatInfo.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Phụ thu ghế:</span>
                    <span className="font-bold text-[#da251d]">
                      {selectedSeatInfo.price === 0 ? "Miễn phí" : `+${selectedSeatInfo.price.toLocaleString('vi-VN')} VND`}
                    </span>
                  </div>

                  <button 
                    onClick={async () => {
                      if (!bookingIdQuery || !selectedSeatInfo.id) return;
                      setIsSaving(true);
                      try {
                        const res = await fetch("/api/booking/seat", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            bookingId: bookingIdQuery,
                            seatNumber: selectedSeatInfo.id
                          })
                        });
                        const data = await res.json();
                        if (res.ok) {
                          // Cập nhật localStorage để trang /manage có thể đọc được ngay
                          try {
                            const storedStr = localStorage.getItem('myBookings');
                            if (storedStr) {
                              const storedBookings = JSON.parse(storedStr);
                              const updatedBookings = storedBookings.map((b: any) => {
                                if ((b.bookingId || b.flightId) === bookingIdQuery) {
                                  return { ...b, seatNumber: selectedSeatInfo.id };
                                }
                                return b;
                              });
                              localStorage.setItem('myBookings', JSON.stringify(updatedBookings));
                            }
                          } catch (e) {
                            console.error("Lỗi cập nhật local storage:", e);
                          }

                          alert(`Đã lưu chỗ ngồi ${selectedSeatInfo.id} thành công cho mã vé ${bookingIdQuery}!`);
                          router.push("/manage");
                        } else {
                          alert(data.message || "Lỗi khi lưu ghế");
                        }
                      } catch (err) {
                        alert("Đã có lỗi xảy ra");
                      }
                      setIsSaving(false);
                    }}
                    disabled={isSaving}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>Đang xử lý <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Xác nhận và Tiếp tục <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">Vui lòng click vào sơ đồ để<br/>chọn chỗ ngồi mong muốn.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Icon helper components
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
