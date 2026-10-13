"use client";

import { useState, useMemo } from "react";
import { Search, Plane, Briefcase, Armchair, Check, AlertCircle, ArrowRight, CheckCircle2, Ticket, CreditCard, Download, UserCheck, ChevronDown, ChevronUp, MapPin, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Dữ liệu Mẫu ---
const MOCK_PNR = "VN789A";
const MOCK_NAME = "NGUYEN";
const MOCK_EMAIL = "nguyen@example.com";
const MOCK_ETICKET = "7381234567890";

const BAGGAGE_PACKAGES = [
  { id: "none", name: "Không mua thêm", price: 0 },
  { id: "10kg", name: "Gói +10 kg", price: 180000 },
  { id: "23kg", name: "Gói +23 kg", price: 350000 },
];

const ROWS = 8;
const COLS = ["A", "B", "C", "D", "E", "F"];
const BOOKED_SEATS = ["1A", "2C", "3F", "5D", "7A"];

type SeatType = "STANDARD" | "LEGROOM";

export default function ManageBookingPage() {
  // Trạng thái Form Tra Cứu
  const [pnr, setPnr] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailOrTicket, setEmailOrTicket] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [realBooking, setRealBooking] = useState<any>(null);

  // Trạng thái Dashboard hiển thị
  const [showBaggageSelect, setShowBaggageSelect] = useState(false);
  const [showSeatSelect, setShowSeatSelect] = useState(false);
  
  // Trạng thái mua sắm
  const [selectedBaggage, setSelectedBaggage] = useState<string>("none");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra định dạng PNR
    if (!/^[A-Z0-9]{6}$/.test(pnr)) {
      setError("Mã đặt chỗ không hợp lệ. Đảm bảo mã đặt chỗ gồm đúng 6 ký tự chữ và số (ví dụ: ABC12D), không chứa dấu cách thừa ở đầu hoặc cuối chuỗi, và viết hoa toàn bộ ký tự.");
      return;
    }
    
    // Tìm trong localStorage
    try {
      const storedStr = localStorage.getItem('myBookings');
      if (storedStr) {
        const storedBookings = JSON.parse(storedStr);
        const match = storedBookings.find((b: any) => {
          const bId = (b.bookingId || b.flightId || "").toUpperCase();
          const bName = (b.fullName || "").toUpperCase();
          const bCccd = (b.idNumber || "").toUpperCase();
          
          const isPnrMatch = bId === pnr.toUpperCase();
          const isNameMatch = bName.includes(lastName.toUpperCase());
          const isCccdMatch = emailOrTicket ? bCccd.includes(emailOrTicket.toUpperCase()) : true;
          
          return isPnrMatch && isNameMatch && isCccdMatch;
        });
        
        if (match) {
          setRealBooking(match);
          setIsVerified(true);
          setError("");
          return;
        }
      }
    } catch (err) {
      console.error("Lỗi khi đọc vé:", err);
    }
    
    // Nếu không tìm thấy, fallback về vé test
    if (pnr.toUpperCase() === MOCK_PNR && lastName.toUpperCase() === MOCK_NAME) {
      setRealBooking(null);
      setIsVerified(true);
      setError("");
    } else {
      setError("Không tìm thấy mã đặt chỗ. Vui lòng kiểm tra lại PNR hoặc Họ.");
    }
  };

  // Tính tiền
  const getBaggagePrice = () => BAGGAGE_PACKAGES.find(p => p.id === selectedBaggage)?.price || 0;
  const getBaggageName = () => BAGGAGE_PACKAGES.find(p => p.id === selectedBaggage)?.name || "Không có";
  
  const getSeatType = (row: number): SeatType => (row === 7 || row === 8) ? "LEGROOM" : "STANDARD";
  const getSeatPrice = (seatId: string | null) => {
    if (!seatId) return 0;
    const row = parseInt(seatId.match(/\d+/)![0]);
    return getSeatType(row) === "LEGROOM" ? 80000 : 0;
  };
  
  const totalPrice = getBaggagePrice() + getSeatPrice(selectedSeat);

  const handlePayment = () => {
    if (totalPrice === 0) {
      alert("Bạn chưa chọn thêm dịch vụ nào có phí.");
      return;
    }
    // Giả lập thanh toán
    setTimeout(() => {
      setIsPaymentSuccess(true);
      setShowBaggageSelect(false);
      setShowSeatSelect(false);
    }, 500);
  };

  // Reset form
  if (isPaymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-8">Các dịch vụ bổ trợ đã được cập nhật vào mã đặt chỗ <b>{realBooking?.bookingId || MOCK_PNR}</b>.</p>
          <button 
            onClick={() => { setIsPaymentSuccess(false); setIsVerified(false); setRealBooking(null); setPnr(""); setLastName(""); }}
            className="w-full bg-[#1d4ed8] text-white rounded-lg py-3 font-semibold hover:bg-blue-800 transition-colors"
          >
            Quay lại trang Quản lý
          </button>
        </div>
      </div>
    );
  }

  // --- BƯỚC 1: TRA CỨU PNR ---
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#005f73] p-6 text-white text-center">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl font-bold">Tra cứu thông tin vé</h1>
            <p className="text-blue-100 mt-2 text-sm">Quản lý đặt chỗ và mua thêm dịch vụ</p>
          </div>
          
          <form onSubmit={handleLookup} className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã đặt chỗ (PNR) *</label>
                <input
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 uppercase focus:border-[#005f73] focus:outline-none transition-colors font-medium"
                  placeholder="VD: ABC12D"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Đảm bảo mã đặt chỗ gồm đúng 6 ký tự chữ và số (ví dụ: ABC12D), không chứa dấu cách thừa ở đầu hoặc cuối chuỗi, và viết hoa toàn bộ ký tự.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ hành khách (Không dấu) *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 uppercase focus:border-[#005f73] focus:outline-none transition-colors font-medium"
                  placeholder="VD: NGUYEN"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số CCCD / Passport (Tùy chọn)</label>
                <input
                  type="text"
                  value={emailOrTicket}
                  onChange={(e) => setEmailOrTicket(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-[#005f73] focus:outline-none transition-colors"
                  placeholder="VD: 072205005868"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full mt-4 bg-[#005f73] text-white rounded-lg py-3.5 font-bold hover:bg-[#004a5a] transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Tra cứu đặt chỗ
              </button>

              <div className="text-center mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                Gợi ý Test: PNR: <b>VN789A</b> | Họ: <b>NGUYEN</b>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Lấy dữ liệu hiển thị (từ vé thật hoặc vé test)
  const displayPnr = realBooking?.bookingId || MOCK_PNR;
  const displayFlight = realBooking?.flightId || "VN123";
  const displayFrom = realBooking?.from || "HAN";
  const displayTo = realBooking?.to || "SGN";
  const displayDate = realBooking?.date || "15 Thg 10";
  const displayClass = realBooking?.pkg || "Phổ thông (Economy)";
  const displayName = realBooking?.fullName || "NGUYEN VAN A";
  const displayPrice = realBooking?.price || "4.778.181 VND";
  const displayId = realBooking?.idNumber || MOCK_ETICKET;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-[#005f73] pb-16 pt-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chi tiết đặt chỗ</h1>
            <p className="text-blue-100 flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold">PNR: {displayPnr}</span>
              <span>Trạng thái: <b className="text-green-300">Đã xác nhận</b></span>
            </p>
          </div>
          <button 
            onClick={() => setIsVerified(false)}
            className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-white/20"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 space-y-6">
        
        {/* Layout 2 cột cho Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT TRÁI (Lớn): Chuyến bay & Dịch vụ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* THÔNG TIN CHUYẾN BAY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#005f73]" />
                <h2 className="text-lg font-bold text-gray-900">Thông tin chuyến bay</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between mb-6">
                  <div className="text-center md:text-left flex-1">
                    <p className="text-2xl font-bold text-[#005f73]">{displayFrom}</p>
                    <p className="text-gray-500 text-sm">Điểm đi</p>
                    <p className="text-gray-800 font-semibold mt-1">12:00, {displayDate}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <p className="text-sm font-bold text-gray-500 mb-1">Mã CB: {displayFlight}</p>
                    <div className="w-full flex items-center">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <Plane className="w-5 h-5 text-gray-400 mx-2" />
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Bay thẳng</p>
                  </div>
                  <div className="text-center md:text-right flex-1">
                    <p className="text-2xl font-bold text-[#005f73]">{displayTo}</p>
                    <p className="text-gray-500 text-sm">Điểm đến</p>
                    <p className="text-gray-800 font-semibold mt-1">14:15, {displayDate}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between text-sm">
                  <div className="flex gap-4 items-center">
                    <span className="text-[#005f73] font-medium pr-4 border-r border-blue-200">Hạng vé: {displayClass}</span>
                    {realBooking?.seatNumber && (
                      <span className="text-[#005f73] font-medium flex items-center gap-1">
                        <Armchair className="w-4 h-4" /> Ghế: <strong className="text-lg">{realBooking.seatNumber}</strong>
                      </span>
                    )}
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Confirmed</span>
                </div>
              </div>
            </div>

            {/* THÔNG TIN HÀNH KHÁCH */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#005f73]" />
                <h2 className="text-lg font-bold text-gray-900">Hành khách</h2>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900 uppercase">{displayName}</p>
                  <p className="text-gray-500 text-sm mt-1">Số giấy tờ / Mã vé: {displayId}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Chưa Check-in
                </span>
              </div>
            </div>

            {/* DỊCH VỤ BỔ TRỢ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#005f73]" />
                <h2 className="text-lg font-bold text-gray-900">Dịch vụ bổ trợ</h2>
              </div>
              <div className="p-6 space-y-6">
                
                {/* Hành lý */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" /> Hành lý ký gửi
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Hiện tại: <span className="font-medium text-gray-900">1 kiện 23kg (Tiêu chuẩn)</span>
                        {selectedBaggage !== 'none' && <span className="text-[#da251d] font-bold"> + {getBaggageName()}</span>}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowBaggageSelect(!showBaggageSelect)}
                      className="text-[#005f73] font-semibold text-sm hover:underline px-3 py-1.5 bg-blue-50 rounded-lg transition-colors"
                    >
                      {showBaggageSelect ? "Đóng" : "Mua thêm hành lý"}
                    </button>
                  </div>
                  
                  {/* Inline Baggage Selector */}
                  {showBaggageSelect && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-4">
                      <div className="space-y-2">
                        {BAGGAGE_PACKAGES.map((pkg) => (
                          <label key={pkg.id} className={cn("flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors", selectedBaggage === pkg.id ? "border-[#005f73] bg-blue-50" : "border-gray-200 hover:border-blue-200")}>
                            <div className="flex items-center gap-3">
                              <input type="radio" name="baggage" className="w-4 h-4 text-[#005f73]" checked={selectedBaggage === pkg.id} onChange={() => setSelectedBaggage(pkg.id)} />
                              <span className="font-semibold text-gray-900 text-sm">{pkg.name}</span>
                            </div>
                            <span className="font-bold text-[#da251d] text-sm">{pkg.price === 0 ? "0đ" : `+${pkg.price.toLocaleString('vi-VN')}đ`}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chỗ ngồi */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Armchair className="w-4 h-4 text-gray-500" /> Chỗ ngồi
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Hiện tại: {selectedSeat ? <span className="font-bold text-[#005f73]">Ghế {selectedSeat}</span> : <span className="text-orange-600 font-medium italic">Chưa chọn chỗ</span>}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowSeatSelect(!showSeatSelect)}
                      className="text-[#005f73] font-semibold text-sm hover:underline px-3 py-1.5 bg-blue-50 rounded-lg transition-colors"
                    >
                      {showSeatSelect ? "Đóng" : "Chọn chỗ ngồi"}
                    </button>
                  </div>
                  
                  {/* Inline Seat Selector */}
                  {showSeatSelect && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-4">
                      <div className="bg-gray-100 rounded-2xl p-4 overflow-x-auto border-4 border-gray-200 mx-auto w-fit">
                        <div className="flex flex-col gap-2 min-w-[280px]">
                          {Array.from({ length: ROWS }).map((_, rIndex) => {
                            const row = rIndex + 1;
                            const isExit = row === 7 || row === 8;
                            return (
                              <div key={row} className="flex justify-center gap-1">
                                <div className="flex gap-1">
                                  {COLS.slice(0, 3).map(col => {
                                    const seatId = `${row}${col}`;
                                    const isBooked = BOOKED_SEATS.includes(seatId);
                                    const isSelected = selectedSeat === seatId;
                                    return (
                                      <button key={seatId} onClick={() => !isBooked && setSelectedSeat(isSelected ? null : seatId)} disabled={isBooked} title={`${seatId}`} className={cn("w-8 h-8 rounded-t-lg rounded-b-sm border flex items-center justify-center text-[10px] font-bold transition-all", isBooked ? "bg-gray-300 text-gray-400 border-gray-400 cursor-not-allowed" : isSelected ? "bg-[#005f73] text-white border-[#005f73] shadow-md scale-110 z-10" : isExit ? "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200" : "bg-white text-[#005f73] border-blue-200 hover:bg-blue-50")}>
                                        {isSelected ? <Check className="w-3 h-3" /> : seatId}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="w-6 flex items-center justify-center text-[10px] text-gray-400 font-bold">{row}</div>
                                <div className="flex gap-1">
                                  {COLS.slice(3, 6).map(col => {
                                    const seatId = `${row}${col}`;
                                    const isBooked = BOOKED_SEATS.includes(seatId);
                                    const isSelected = selectedSeat === seatId;
                                    return (
                                      <button key={seatId} onClick={() => !isBooked && setSelectedSeat(isSelected ? null : seatId)} disabled={isBooked} title={`${seatId}`} className={cn("w-8 h-8 rounded-t-lg rounded-b-sm border flex items-center justify-center text-[10px] font-bold transition-all", isBooked ? "bg-gray-300 text-gray-400 border-gray-400 cursor-not-allowed" : isSelected ? "bg-[#005f73] text-white border-[#005f73] shadow-md scale-110 z-10" : isExit ? "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200" : "bg-white text-[#005f73] border-blue-200 hover:bg-blue-50")}>
                                        {isSelected ? <Check className="w-3 h-3" /> : seatId}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4 text-xs justify-center flex-wrap">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-blue-200 rounded"></div> Tiêu chuẩn (0đ)</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div> Để chân rộng (+80.000đ)</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded"></div> Đã bán</div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* CỘT PHẢI (Nhỏ): Tóm tắt & Quick Actions */}
          <div className="space-y-6">
            
            {/* TÓM TẮT THANH TOÁN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#005f73]" /> Thanh toán
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tiền vé đã trả:</span>
                  <span className="font-semibold text-gray-900">{displayPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phương thức:</span>
                  <span className="font-semibold text-gray-900">VNPAY (Thẻ tín dụng)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Trạng thái HĐ:</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-xs">Đã thanh toán</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#005f73]" /> Thao tác nhanh
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#005f73] hover:bg-blue-50 transition-colors group">
                  <span className="font-semibold text-gray-700 group-hover:text-[#005f73]">In / Tải vé điện tử (PDF)</span>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-[#005f73]" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed transition-colors" title="Chỉ mở trước giờ bay 24 tiếng">
                  <span className="font-semibold">Làm thủ tục trực tuyến</span>
                  <AlertCircle className="w-5 h-5" />
                </button>
                <p className="text-xs text-gray-500 text-center italic mt-1">Check-in online mở trước giờ khởi hành 24 tiếng.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Thanh Tóm Tắt Phát Sinh (Sticky Bottom) - Chỉ hiện khi có tiền phát sinh */}
      {totalPrice > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-full">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="text-lg">
                <span className="text-gray-500 font-medium">Tổng phí dịch vụ mới:</span>{" "}
                <span className="font-bold text-[#da251d] text-2xl">{totalPrice.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="text-gray-500 text-xs">
                (Hành lý: {getBaggagePrice().toLocaleString('vi-VN')}đ | Ghế: {getSeatPrice(selectedSeat).toLocaleString('vi-VN')}đ)
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#da251d] text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md"
            >
              Thanh toán dịch vụ
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
