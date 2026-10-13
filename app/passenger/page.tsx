"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Plane, Calendar, User, CreditCard } from "lucide-react";
import Link from "next/link";

interface StoredUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  idNumber?: string;
  role?: string;
  walletBalance?: number;
}

export default function PassengerPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    idNumber: "",
  });

  // Auto-fill form with user data if logged in
  useEffect(() => {
    // Ưu tiên dùng currentUser (từ trang profile)
    const userJson = localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (userJson) {
      try {
        const userData: StoredUser = JSON.parse(userJson);
        
        // Format date of birth to YYYY-MM-DD for date input
        let formattedDob = "";
        if (userData.dateOfBirth) {
          const dobDate = new Date(userData.dateOfBirth);
          if (!isNaN(dobDate.getTime())) {
            formattedDob = dobDate.toISOString().split('T')[0];
          }
        }

        // Auto-fill form with user data
        setFormData({
          fullName: userData.fullName || "",
          dob: formattedDob,
          idNumber: userData.idNumber || "",
        });
      } catch (error) {
        console.error("Lỗi khi đọc thông tin user từ localStorage:", error);
      }
    }
  }, []);

  const flightId = searchParams.get("flightId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const pkg = searchParams.get("package");
  const price = searchParams.get("price");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gom tất cả parameters lại và chuyển sang trang Ancillary
    const params = new URLSearchParams();
    params.set("flightId", flightId || "VN001");
    params.set("from", from || "HAN");
    params.set("to", to || "SGN");
    params.set("date", date || "2026-08-18");
    params.set("pax", searchParams.get("pax") || "1");
    params.set("package", pkg || "Phổ thông");
    params.set("price", price || "0 VND");
    params.set("fullName", formData.fullName);
    params.set("dob", formData.dob);
    params.set("idNumber", formData.idNumber);
    
    window.location.href = `/ancillary?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl p-4 pt-24 pb-16 w-full">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#006079] transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại tìm vé
        </Link>
        <h1 className="text-3xl font-bold text-[#006079]">
          Thông tin hành khách
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Vui lòng điền đầy đủ thông tin theo CCCD/Passport để hoàn tất đặt vé.
        </p>
      </div>

      {/* Flight Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="h-5 w-5 text-[#006079]" />
          <h2 className="text-lg font-semibold text-gray-900">
            Chi tiết chuyến bay đã chọn
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã chuyến bay</span>
              <span className="font-semibold text-gray-900">{flightId || "VN..."}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hành trình</span>
              <span className="font-semibold text-gray-900">
                {from || "HAN"} ✈️ {to || "SGN"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ngày bay</span>
              <span className="font-semibold text-gray-900">{date || "08/08/2026"}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số hành khách</span>
              <span className="font-semibold text-gray-900">{searchParams.get("pax") || "1"} người</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Hạng vé</span>
              <span className="font-semibold text-gray-900">{pkg || "Phổ thông"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tổng giá</span>
              <span className="font-bold text-[#006079]">{price || "0 VND"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-[#006079]" />
          <h2 className="text-lg font-semibold text-gray-900">
            Thông tin người đặt vé
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên đầy đủ"
                required
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20 outline-none"
              />
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="dob" className="mb-1.5 block text-sm font-medium text-gray-700">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20 outline-none"
              />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="idNumber" className="mb-1.5 block text-sm font-medium text-gray-700">
              Số CCCD / Passport <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Nhập số CCCD hoặc Passport"
                required
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#006079] focus:ring-2 focus:ring-[#006079]/20 outline-none"
              />
              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/"
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="rounded-full bg-[#006079] px-8 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-[#004d61]"
            >
              Tiếp tục
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
