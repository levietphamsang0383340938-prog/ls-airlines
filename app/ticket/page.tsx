"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { CheckCircle2, Plane, Download, Home, User, Calendar, MapPin, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";

interface StoredUser {
  fullName: string;
  email: string;
  phone: string;
}

function TicketContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const userData: StoredUser = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi đọc thông tin user từ localStorage:", error);
      }
    }
  }, []);

  const flightId = searchParams.get("flightId") || "VN...";
  const from = searchParams.get("from") || "HAN";
  const to = searchParams.get("to") || "SGN";
  const date = searchParams.get("date") || "08/08/2026";
  const pkg = searchParams.get("package") || "Phổ thông";
  const price = searchParams.get("price") || "0 VND";

  const generatePNR = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const pnr = searchParams.get("pnr") || "ABC123XP";

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#006079] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl p-4 pt-24 pb-16 w-full">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-lg text-gray-600">
          Mã đặt chỗ (PNR): <span className="font-bold text-[#006079]">{pnr}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Vui lòng lưu mã PNR này để làm thủ tục lên máy bay.
        </p>
      </div>

      {/* Boarding Pass */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="flex-1 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Plane className="h-6 w-6 text-[#006079]" />
              <span className="text-lg font-bold text-[#006079]">Azure Air</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{from}</p>
                  <p className="text-xs text-gray-500">Điểm đi</p>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-300" />
                  <Plane className="h-4 w-4 text-gray-400 rotate-90" />
                  <div className="h-px flex-1 bg-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{to}</p>
                  <p className="text-xs text-gray-500">Điểm đến</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ngày bay</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900">{date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mã chuyến bay</p>
                  <div className="flex items-center gap-1.5">
                    <Ticket className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900">{flightId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hạng vé</p>
                  <p className="text-sm font-semibold text-gray-900">{pkg}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hành khách</p>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.fullName || "Đang tải..."}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cửa ra máy bay</p>
                  <p className="text-sm font-semibold text-gray-900">Gate 05</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ghế ngồi</p>
                  <p className="text-sm font-semibold text-gray-900">Seat 12A</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="hidden md:block w-px border-l-2 border-dashed border-gray-300" />

          {/* Right Column - Barcode */}
          <div className="flex-1 p-6 md:p-8 bg-gray-50 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full max-w-[200px]">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AzureAirTicketPNR"
                alt="Mã vạch vé"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700 text-center">
              Quét tại cửa khởi hành
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNR: {pnr}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#006079] px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-[#004d61]"
        >
          <Download className="h-4 w-4" />
          Tải vé PDF
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Home className="h-4 w-4" />
          Trang chủ
        </Link>
      </div>
      </div>
    </div>
  );
}

export default function TicketSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <TicketContent />
    </Suspense>
  );
}
