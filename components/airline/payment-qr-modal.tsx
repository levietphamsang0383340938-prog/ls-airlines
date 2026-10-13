"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentQRModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  onTimeout: () => void;
};

export function PaymentQRModal({ isOpen, onClose, amount, onTimeout }: PaymentQRModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(3600);
    setIsSuccess(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onTimeout]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleDevSimulate = async () => {
    setIsSuccess(true);
    
    // Generate PNR
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pnr = "";
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Lấy thông tin user
    const userJson = localStorage.getItem("currentUser");
    let userData = { email: "sang.leviet@example.com", fullName: "LE VIET PHAM SANG", cccd: "072205005868" };
    if (userJson) {
      try {
        userData = JSON.parse(userJson);
        // Default mock CCCD if not in user object
        if (!userData.cccd) userData.cccd = "072205005868";
      } catch (e) {}
    }

    // Call email API
    try {
      const lastName = userData.fullName ? userData.fullName.split(" ").pop()?.toUpperCase() : "NGUYEN";
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TICKET",
          email: userData.email,
          data: {
            fullName: userData.fullName,
            bookingId: pnr,
            from: searchParams.get("from") || "SGN",
            to: searchParams.get("to") || "HAN",
            flightId: searchParams.get("flightId") || "VN123",
            date: searchParams.get("date") || "08/08/2026",
            pkg: searchParams.get("package") || "Phổ thông",
            price: amount,
            lastName: lastName,
            cccd: userData.cccd
          }
        })
      });
    } catch (e) {
      console.error("Lỗi gửi email xác nhận:", e);
    }

    // Lưu vào localStorage để tra cứu
    try {
      const newBooking = {
        bookingId: pnr,
        flightId: searchParams.get("flightId") || "VN123",
        from: searchParams.get("from") || "SGN",
        to: searchParams.get("to") || "HAN",
        date: searchParams.get("date") || "08/08/2026",
        pkg: searchParams.get("package") || "Phổ thông",
        price: amount,
        fullName: userData.fullName,
        idNumber: userData.cccd
      };
      const existingBookingsStr = localStorage.getItem("myBookings");
      const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
      existingBookings.push(newBooking);
      localStorage.setItem("myBookings", JSON.stringify(existingBookings));
    } catch (e) {
      console.error("Lỗi lưu booking vào local storage", e);
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Chuyển hướng kèm thêm PNR
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("pnr", pnr);
      router.push("/ticket?" + newSearchParams.toString());
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto p-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-3" />
              <p className="text-lg font-bold text-gray-800">Thanh toán thành công!</p>
              <p className="text-sm text-gray-500 mt-1">Đang chuyển hướng...</p>
            </div>
          ) : (
          <>
            <div className="mb-3 text-center">
              <h2 className="text-xl font-bold text-gray-900">Thanh toán QR Code</h2>
              <p className="mt-1 text-2xl font-bold text-[#006079]">{amount}</p>
            </div>

            <div className="p-2 mb-2 flex flex-col items-center">
              <img
                src="https://img.vietqr.io/image/MB-0383340938-compact2.png?accountName=LE%20VIET%20PHAM%20SANG"
                alt="QR Code thanh toán VietQR"
                className="w-48 sm:w-56 h-auto object-contain mx-auto rounded-xl border border-gray-200"
              />
              <div className="mt-2 text-center text-sm font-bold text-gray-800">
                <p>Ngân hàng: MBBank</p>
                <p>Chủ tài khoản: LE VIET PHAM SANG</p>
                <p>Số tài khoản: 0383340938</p>
              </div>
              <div className="mt-2 flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <Clock className="h-4 w-4" />
                Thời gian còn lại: {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mb-3 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>Mở app ngân hàng và quét mã QR để hoàn tất thanh toán.</span>
            </div>

            <button
              type="button"
              onClick={handleDevSimulate}
              className="w-full rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              [Dev] Giả lập quét QR thành công
            </button>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
