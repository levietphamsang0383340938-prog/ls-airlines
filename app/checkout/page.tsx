"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Plane, 
  Calendar, 
  User, 
  CreditCard, 
  Clock, 
  QrCode, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Building2,
  Download,
  Ticket as TicketIcon,
  ArrowRight,
  Loader2,
  Wallet,
  Info
} from "lucide-react";
import Link from "next/link";

type BookingStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUND_PENDING";

interface BookingData {
  bookingId?: string;
  flightId: string;
  from: string;
  to: string;
  date: string;
  pax: string;
  pkg: string;
  price: string;
  fullName: string;
  dob: string;
  idNumber: string;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<BookingStatus>("PENDING");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER" | "WALLET">("TRANSFER");

  // State cho Modal Hủy vé
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customCancelReason, setCustomCancelReason] = useState("");

  // Parse booking data from URL params
  useEffect(() => {
    const data: BookingData = {
      bookingId: searchParams.get("bookingId") || undefined,
      flightId: searchParams.get("flightId") || "VN001",
      from: searchParams.get("from") || "HAN",
      to: searchParams.get("to") || "SGN",
      date: searchParams.get("date") || "2026-08-18",
      pax: searchParams.get("pax") || "1",
      pkg: searchParams.get("package") || "Phổ thông",
      price: searchParams.get("price") || "2,500,000 VND",
      fullName: searchParams.get("fullName") || "",
      dob: searchParams.get("dob") || "",
      idNumber: searchParams.get("idNumber") || "",
    };
    setBookingData(data);

    // Set expiration time (current time + 1 hour)
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
    setExpiresAt(expirationTime);

    // Lấy thông tin người dùng đang đăng nhập
    try {
      const storedUserStr = localStorage.getItem('currentUser');
      if (storedUserStr) {
        const user = JSON.parse(storedUserStr);
        setCurrentUser(user);
        if (user.email) setUserEmail(user.email);
      }
    } catch (e) {
      console.error(e);
    }
  }, [searchParams]);

  // Save to localStorage and Send Email when PAID
  useEffect(() => {
    if (status === "PAID" && bookingData) {
      try {
        const storedStr = localStorage.getItem('myBookings');
        const stored = storedStr ? JSON.parse(storedStr) : [];
        const currentId = bookingData.bookingId || bookingData.flightId;
        const exists = stored.some((b: any) => (b.bookingId || b.flightId) === currentId);
        
        if (!exists) {
          // 1. Lưu vào localStorage
          stored.push(bookingData);
          localStorage.setItem('myBookings', JSON.stringify(stored));
          
          // 2. Gửi Email (nếu có email)
          const targetEmail = userEmail || 'levietphamsang0383340938@gmail.com'; // fallback nếu khách chưa đăng nhập
          
          const lastName = bookingData.fullName ? bookingData.fullName.split(" ").pop()?.toUpperCase() : "NGUYEN";
          const enhancedBookingData = {
            ...bookingData,
            lastName: lastName,
            cccd: bookingData.idNumber || ""
          };

          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'TICKET',
              data: enhancedBookingData,
              email: targetEmail
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              console.log("Email đã được gửi thành công!");
            } else {
              console.error("Gửi email thất bại:", data.error);
            }
          })
          .catch(err => console.error("Lỗi gọi API gửi email:", err));
        }
      } catch (e) {
        console.error("Lỗi lưu hoặc gửi vé:", e);
      }
    }
  }, [status, bookingData]);

  // Countdown timer logic
  useEffect(() => {
    if (status !== "PENDING") return;
    
    const bId = searchParams.get("bookingId") || "demo";
    const expireKey = `booking_expire_${bId}`;
    
    const storedExpire = localStorage.getItem(expireKey);
    if (!storedExpire) {
      const expireTime = Date.now() + 3600 * 1000;
      localStorage.setItem(expireKey, expireTime.toString());
      setTimeLeft(3600);
    } else {
      const remaining = Math.floor((parseInt(storedExpire) - Date.now()) / 1000);
      if (remaining <= 0) {
        setStatus("CANCELLED");
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }

    const timer = setInterval(() => {
      const currentStored = localStorage.getItem(expireKey);
      if (currentStored) {
        const remaining = Math.floor((parseInt(currentStored) - Date.now()) / 1000);
        if (remaining <= 0) {
          clearInterval(timer);
          setStatus("CANCELLED");
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, searchParams]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!bookingData) return;
    
    setIsProcessingPayment(true);

    try {
      if (paymentMethod === "WALLET") {
        // Thanh toán bằng Ví điện tử LS Wallet
        if (!currentUser) {
          alert("Vui lòng đăng nhập để thanh toán bằng Ví điện tử.");
          setIsProcessingPayment(false);
          return;
        }

        // Chuyển đổi giá tiền từ chuỗi (vd: "4.822.181 VND") sang số (4822181)
        const numericPrice = parseInt(bookingData.price.replace(/\D/g, ''));
        const currentBalance = currentUser.walletBalance || 0;

        if (currentBalance < numericPrice) {
          alert("Số dư ví không đủ! Vui lòng nạp thêm tiền vào ví.");
          setIsProcessingPayment(false);
          return;
        }

        // 2.1 Trừ tiền trong ví và lưu lịch sử (Gọi API spend)
        const spendResponse = await fetch('/api/wallet/spend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser._id,
            amount: numericPrice,
            description: `Thanh toán mã vé máy bay ${bookingData.bookingId || bookingData.flightId}`
          })
        });

        if (!spendResponse.ok) {
          const errData = await spendResponse.json();
          alert(errData.message || "Lỗi trừ tiền trong ví.");
          setIsProcessingPayment(false);
          return;
        }

        // Cập nhật lại số dư ví ở LocalStorage
        const updatedUser = { ...currentUser, walletBalance: currentBalance - numericPrice };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        // 2.2 Gọi API duyệt vé
        const bookingResponse = await fetch('/api/booking/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: bookingData.bookingId || bookingData.flightId,
            status: 'PAID'
          }),
        });

        if (bookingResponse.ok) {
          setStatus("PAID");
          localStorage.setItem("ticket_" + (bookingData.bookingId || bookingData.flightId) + "_status", "PAID");
        } else {
          alert("Trừ tiền thành công nhưng lỗi duyệt vé. Vui lòng liên hệ CSKH.");
        }
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle Cancel Booking Button Click
  const handleCancelBooking = () => {
    if (!bookingData?.bookingId && !bookingData?.flightId) return;
    setIsCancelModalOpen(true);
  };

  // Logic gọi API hủy vé và gửi email
  const submitCancelBooking = async () => {
    if (!bookingData?.bookingId && !bookingData?.flightId) return;
    
    const finalReason = cancelReason === "Khác" ? customCancelReason : cancelReason;
    if (!finalReason) {
      alert("Vui lòng chọn hoặc nhập lý do hủy vé.");
      return;
    }
    
    setIsCancelling(true);
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingData.bookingId || bookingData.flightId }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("CANCELLED");
        localStorage.setItem("ticket_" + (bookingData.bookingId || bookingData.flightId) + "_status", "CANCELLED");
        
        // Gửi email thông báo hủy vé & hoàn tiền
        const numericPrice = parseInt(bookingData.price.replace(/\D/g, ''));
        const fee = numericPrice * 0.1; // phí 10%
        const refund = numericPrice - fee;
        
        const formatMoney = (val: number) => val.toLocaleString('vi-VN') + " VND";
        
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CANCEL',
            email: currentUser?.email || "khachhang@example.com",
            data: {
              bookingData: bookingData,
              cancelReason: finalReason,
              refundAmount: formatMoney(refund),
              cancelFee: formatMoney(fee)
            }
          })
        });

        alert("Yêu cầu hủy vé đã được tiếp nhận. Email thông báo chi tiết hoàn tiền đã được gửi!");
        setIsCancelModalOpen(false);
      } else {
        alert(data.error || "Lỗi khi hủy vé");
      }
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra");
    } finally {
      setIsCancelling(false);
    }
  };

  // Download E-Ticket as PDF
  const handleDownloadTicket = () => {
    window.print();
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đặt vé...</p>
        </div>
      </div>
    );
  }

  const pkgParts = bookingData.pkg.split(" + ");
  const basePackageName = pkgParts[0];
  const extrasString = pkgParts.length > 1 ? pkgParts.slice(1).join(" + ") : "";
  const extrasList = extrasString ? extrasString.split(", ") : [];

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 w-full">
        {/* Header */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#006079] transition-colors mb-2"
          >
            <ChevronLeft className="h-3 w-3" />
            Quay lại trang chủ
          </Link>
          <h1 className="text-2xl font-bold text-[#006079]">
            Chi tiết vé & Thanh toán
          </h1>
        </div>

        {/* Status Banner */}
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          status === "PENDING" ? "bg-yellow-50 border border-yellow-200" :
          status === "PAID" ? "bg-green-50 border border-green-200" :
          "bg-red-50 border border-red-200"
        }`}>
          {status === "PENDING" && (
            <>
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800 text-sm">Đang chờ thanh toán (chọn hình thức thanh toán)</p>
                <p className="text-xs text-yellow-700">Thời gian còn lại: {formatTime(timeLeft)}</p>
              </div>
            </>
          )}
          {status === "PAID" && (
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="font-semibold text-green-800 text-sm">Thanh toán thành công</p>
              </div>
              <p className="text-sm text-green-700 ml-6 mt-1">
                Chi tiết chuyến bay và Mã đặt chỗ đã được gửi về email <b>{userEmail || 'levietphamsang0383340938@gmail.com'}</b>. Vui lòng kiểm tra hộp thư!
              </p>
            </div>
          )}
          {status === "CANCELLED" && (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <p className="font-semibold text-red-800 text-sm">Đã hủy (hết thời gian thanh toán hoặc bị hủy bỏ)</p>
            </>
          )}
          {status === "REFUND_PENDING" && (
            <>
              <Clock className="h-4 w-4 text-orange-600" />
              <p className="font-semibold text-orange-800 text-sm">Đang chờ hoàn tiền (Vé đã hủy)</p>
            </>
          )}
        </div>

        {/* Flight Details Card */}
        {status !== "PAID" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="h-4 w-4 text-[#006079]" />
              <h2 className="text-base font-semibold text-gray-900">
                Thông tin chuyến bay
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Mã chuyến bay</span>
                  <span className="font-semibold text-gray-900">{bookingData.flightId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Hành trình</span>
                  <span className="font-semibold text-gray-900">
                    {bookingData.from} ✈️ {bookingData.to}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Ngày bay</span>
                  <span className="font-semibold text-gray-900">{bookingData.date}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Số hành khách</span>
                  <span className="font-semibold text-gray-900">{bookingData.pax} người</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Hạng vé</span>
                  <span className="font-semibold text-gray-900">{basePackageName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Tổng giá</span>
                  <span className="font-bold text-[#006079] text-sm">{bookingData.price}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Details Card */}
        {status !== "PAID" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-[#006079]" />
              <h2 className="text-base font-semibold text-gray-900">
                Thông tin hành khách & Dịch vụ
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Họ và tên</span>
                <span className="font-semibold text-gray-900">{bookingData.fullName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Ngày sinh</span>
                <span className="font-semibold text-gray-900">{bookingData.dob}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Số CCCD / Passport</span>
                <span className="font-semibold text-gray-900">{bookingData.idNumber}</span>
              </div>
              {extrasList.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 block mb-1">Dịch vụ đã mua</span>
                  <div className="flex flex-wrap gap-1.5">
                    {extrasList.map((extra, idx) => (
                      <span key={idx} className="bg-[#eaaa00]/10 text-[#006079] border border-[#eaaa00]/30 px-2 py-0.5 rounded text-xs font-semibold">
                        {extra}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* E-Ticket Card - PAID Status */}
        {status === "PAID" && (
          <div id="eticket-content" className="bg-gradient-to-br from-[#005f73] to-[#004d61] rounded-2xl shadow-lg p-1.5 mb-6">
            <div className="bg-white rounded-xl p-5">
              {/* Ticket Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="bg-[#005f73] p-1.5 rounded-lg">
                    <TicketIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#005f73]">Vé điện tử (E-Ticket)</h3>
                    <p className="text-xs text-gray-500">Mã đặt vé: {bookingData.bookingId || bookingData.flightId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  <p className="text-sm font-semibold text-green-600">Đã thanh toán</p>
                </div>
              </div>

              {/* Flight Route */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-[#005f73]">{bookingData.from}</p>
                  <p className="text-xs text-gray-500">Nơi đi</p>
                </div>
                <div className="flex flex-col items-center px-3">
                  <Plane className="h-6 w-6 text-[#005f73] mb-0.5" />
                  <div className="w-20 h-0.5 bg-gray-300 relative">
                    <div className="absolute w-1.5 h-1.5 bg-[#005f73] rounded-full -top-0.5 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Chuyến bay thẳng</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-[#005f73]">{bookingData.to}</p>
                  <p className="text-xs text-gray-500">Nơi đến</p>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Mã chuyến bay</p>
                  <p className="font-semibold text-gray-900 text-sm">{bookingData.flightId}</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Ngày bay</p>
                  <p className="font-semibold text-gray-900 text-sm">{bookingData.date}</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Giờ khởi hành</p>
                  <p className="font-semibold text-gray-900 text-sm">08:30</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Giờ chuẩn bị khởi hành</p>
                  <p className="font-semibold text-gray-900 text-sm">07:30</p>
                </div>
              </div>

              {/* Passenger Information */}
              <div className="bg-[#005f73]/5 p-3 rounded-lg mb-4">
                <h4 className="font-semibold text-[#005f73] mb-2 flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5" />
                  Thông tin hành khách
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Họ và tên</p>
                    <p className="font-medium text-gray-900 text-sm">{bookingData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Số CCCD / Passport</p>
                    <p className="font-medium text-gray-900 text-sm">{bookingData.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Ngày sinh</p>
                    <p className="font-medium text-gray-900 text-sm">{bookingData.dob}</p>
                  </div>
                </div>
              </div>

              {/* Ancillary Services (If any) */}
              {extrasList.length > 0 && (
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg mb-4">
                  <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2 text-sm">
                    <Building2 className="h-3.5 w-3.5" />
                    Dịch vụ bổ trợ đã mua
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {extrasList.map((extra, idx) => (
                      <span key={idx} className="bg-white border border-orange-200 text-orange-700 px-2 py-1 rounded text-xs font-bold shadow-sm">
                        {extra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Hạng vé</p>
                    <p className="font-medium text-gray-900 text-sm">{basePackageName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Số hành khách</p>
                    <p className="font-medium text-gray-900 text-sm">{bookingData.pax} người</p>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="text-xl font-bold text-[#005f73]">{bookingData.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Trạng thái thanh toán</p>
                  <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Đã thanh toán
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {status === "PENDING" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-[#006079]" />
              <h2 className="text-base font-semibold text-gray-900">
                Thông tin thanh toán
              </h2>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Lựa chọn phương thức thanh toán */}
              <div className="w-full flex gap-3 mb-2">
                <button
                  onClick={() => setPaymentMethod("TRANSFER")}
                  className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === "TRANSFER" 
                    ? "border-[#006079] bg-[#006079]/5 ring-1 ring-[#006079]" 
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                  }`}
                >
                  <Building2 className={`h-6 w-6 ${paymentMethod === "TRANSFER" ? "text-[#006079]" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${paymentMethod === "TRANSFER" ? "text-[#006079]" : "text-gray-600"}`}>
                    Chuyển khoản VietQR
                  </span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod("WALLET")}
                  className={`flex-1 p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === "WALLET" 
                    ? "border-[#006079] bg-[#006079]/5 ring-1 ring-[#006079]" 
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                  }`}
                >
                  <Wallet className={`h-6 w-6 ${paymentMethod === "WALLET" ? "text-[#006079]" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${paymentMethod === "WALLET" ? "text-[#006079]" : "text-gray-600"}`}>
                    Ví LS Wallet
                  </span>
                </button>
              </div>

              {paymentMethod === "TRANSFER" && (
                <>
                  <div className="bg-gray-100 p-3 rounded-lg text-center flex flex-col items-center justify-center">
                    <img 
                      src={`https://img.vietqr.io/image/970422-0383340938-compact.png?amount=${parseInt(bookingData.price.replace(/\\D/g, ''))}&addInfo=${bookingData.bookingId || bookingData.flightId}&accountName=LE%20VIET%20PHAM%20SANG`} 
                      alt="VietQR" 
                      className="w-64 h-64 object-contain mix-blend-multiply"
                    />
                    <p className="text-sm text-gray-500 mt-2 italic">Hệ thống sẽ tự động xuất vé sau khi nhận được thanh toán.</p>
                  </div>
                  
                  <div className="text-center space-y-1 w-full bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="h-4 w-4 text-[#006079]" />
                      <p className="font-bold text-gray-900 text-sm">Ngân hàng MBBANK</p>
                    </div>
                    <p className="text-base font-semibold text-gray-900">STK: 0383340938</p>
                    <p className="text-sm text-[#006079] font-bold py-1">Nội dung: {bookingData.bookingId || bookingData.flightId}</p>
                    <p className="text-xs text-gray-500 pt-2">
                      Hết hạn: {expiresAt?.toLocaleString('vi-VN')}
                    </p>
                  </div>
                </>
              )}

              {paymentMethod === "WALLET" && (
                <div className="w-full bg-cyan-50 p-5 rounded-xl border border-cyan-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-[#006079]" />
                      <span className="font-bold text-gray-900">Số dư Ví LS Wallet</span>
                    </div>
                    <span className="text-lg font-bold text-[#006079]">
                      {currentUser ? (currentUser.walletBalance || 0).toLocaleString() : 0} <span className="text-sm">VND</span>
                    </span>
                  </div>
                  {!currentUser ? (
                    <p className="text-sm text-red-600 font-medium">Bạn cần đăng nhập để sử dụng Ví.</p>
                  ) : (currentUser.walletBalance || 0) < parseInt(bookingData.price.replace(/\D/g, '')) ? (
                    <div className="pt-2 border-t border-cyan-200">
                      <p className="text-sm text-red-600 font-medium mb-2">Số dư không đủ. Vui lòng nạp thêm tiền.</p>
                      <Link href="/profile" className="text-sm bg-white text-[#006079] border border-[#006079] px-4 py-1.5 rounded-lg font-semibold hover:bg-cyan-50 transition">
                        Đến trang Nạp tiền
                      </Link>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-cyan-200">
                      <p className="text-sm text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Số dư khả dụng để thanh toán
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {status === "PENDING" && (
            <>
              {paymentMethod === "WALLET" && (
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="rounded-full bg-[#006079] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#004d61] disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Thanh toán qua Ví"
                  )}
                </button>
              )}
            </>
          )}
          {status === "PAID" && (
            <>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="rounded-full px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isCancelling ? "Đang xử lý..." : "Hủy vé / Hoàn tiền"}
              </button>
              <button
                onClick={handleDownloadTicket}
                className="rounded-full bg-white border-2 border-[#006079] text-[#006079] px-4 py-2 text-xs font-semibold shadow-md transition-colors hover:bg-gray-50 flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Tải vé điện tử (PDF)
              </button>
              <Link
                href="/"
                className="rounded-full bg-[#006079] px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#004d61]"
              >
                Quay về Trang chủ
              </Link>
            </>
          )}
          {status === "CANCELLED" && (
            <Link
              href="/"
              className="rounded-full bg-[#006079] px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#004d61]"
            >
              Đặt vé lại
            </Link>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Yêu cầu Hủy vé & Hoàn tiền
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Bạn đang yêu cầu hủy vé cho chuyến bay <span className="font-bold text-gray-900">{bookingData?.flightId}</span>. Vui lòng chọn lý do để chúng tôi hỗ trợ hoàn tiền nhanh nhất:
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Lý do hủy vé <span className="text-red-500">*</span></label>
                <select 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Thay đổi lịch trình cá nhân">Thay đổi lịch trình cá nhân</option>
                  <option value="Chuyến bay bị hoãn/trễ giờ quá lâu">Chuyến bay bị hoãn/trễ giờ quá lâu</option>
                  <option value="Vấn đề sức khỏe">Vấn đề sức khỏe</option>
                  <option value="Đặt sai thông tin vé">Đặt sai thông tin vé</option>
                  <option value="Khác">Lý do khác...</option>
                </select>
              </div>

              {cancelReason === "Khác" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nhập lý do cụ thể <span className="text-red-500">*</span></label>
                  <textarea 
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 outline-none min-h-[80px]"
                    placeholder="Vui lòng cho biết lý do chi tiết..."
                  ></textarea>
                </div>
              )}

              <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex gap-3">
                <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-800 space-y-1">
                  <p><strong>Lưu ý về hoàn tiền:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Hệ thống sẽ thu <strong>10% phí thủ tục</strong> trên tổng giá trị vé.</li>
                    <li>Tiền sẽ được hoàn lại về ví/thẻ trong vòng 7-14 ngày làm việc.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                disabled={isCancelling}
              >
                Đóng lại
              </button>
              <button 
                onClick={submitCancelBooking}
                disabled={isCancelling || !cancelReason || (cancelReason === "Khác" && !customCancelReason)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : "Xác nhận Hủy & Hoàn tiền"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}