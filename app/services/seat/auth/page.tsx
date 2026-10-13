"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeatAuthPage() {
  const router = useRouter();
  const [bookingId, setBookingId] = useState("");
  const [flightId, setFlightId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || !flightId) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/booking/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, flightId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Nếu xác thực thành công, lưu thông tin fullName vào localStorage tạm thời
        // để hiển thị bên trang chọn chỗ ngồi (nếu muốn)
        localStorage.setItem("verified_booking", JSON.stringify({
          bookingId: data.booking.bookingId,
          flightId: data.booking.flightId,
          fullName: data.booking.fullName,
        }));
        
        router.push(`/services/seat?bookingId=${data.booking.bookingId}`);
      } else {
        setError(data.message || "Xác thực thất bại.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
        
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-[#1d4ed8]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Xác thực vé
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vui lòng nhập thông tin vé đã thanh toán của bạn để tiếp tục sử dụng dịch vụ chọn chỗ ngồi.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">
                Mã đặt chỗ (Booking ID)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Ticket className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="bookingId"
                  name="bookingId"
                  type="text"
                  required
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                  className="block w-full rounded-md border border-gray-300 pl-10 px-3 py-2.5 text-gray-900 focus:border-[#1d4ed8] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] sm:text-sm uppercase"
                  placeholder="Ví dụ: 6VBA1Y"
                />
              </div>
            </div>

            <div>
              <label htmlFor="flightId" className="block text-sm font-medium text-gray-700">
                Mã chuyến bay (Flight Code)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Plane className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="flightId"
                  name="flightId"
                  type="text"
                  required
                  value={flightId}
                  onChange={(e) => setFlightId(e.target.value.toUpperCase())}
                  className="block w-full rounded-md border border-gray-300 pl-10 px-3 py-2.5 text-gray-900 focus:border-[#1d4ed8] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] sm:text-sm uppercase"
                  placeholder="Ví dụ: VJ 1141"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-6 px-4 rounded-md shadow-sm text-base font-bold text-white bg-[#1d4ed8] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d4ed8] transition-colors"
            >
              {loading ? "Đang kiểm tra..." : "Xác nhận & Tiếp tục"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
