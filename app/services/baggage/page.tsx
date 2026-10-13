"use client";

import { useState } from "react";
import { Check, Info, AlertCircle, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const baggagePackages = [
  { id: "none", name: "Không mua thêm", price: 0, desc: "Giữ nguyên tiêu chuẩn hành lý hiện tại" },
  { id: "10kg", name: "Gói +10 kg", price: 180000, desc: "Phù hợp cho chuyến đi ngắn ngày" },
  { id: "23kg", name: "Gói +23 kg", price: 350000, desc: "Khuyên dùng cho chuyến đi dài ngày" },
  { id: "32kg", name: "Gói +32 kg", price: 500000, desc: "Mang theo tối đa đồ đạc bạn cần" },
];

export default function BaggageServicePage() {
  const [selectedPackage, setSelectedPackage] = useState<string>("none");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1d4ed8] mb-2 flex items-center gap-3">
              <Briefcase className="h-8 w-8" />
              Hành lý ký gửi
            </h1>
            <p className="text-gray-600">Mua trước hành lý, tiết kiệm chi phí lên đến 50% so với mua tại sân bay.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
          
          {/* Thông tin tiêu chuẩn miễn phí */}
          <div className="mb-8 rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-4">
            <Info className="h-6 w-6 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#1d4ed8] mb-1">Thông tin tiêu chuẩn miễn phí</h3>
              <p className="text-sm text-gray-700">
                Vé của bạn đã bao gồm sẵn: <span className="font-bold">1 kiện 12kg xách tay + 1 kiện 23kg ký gửi</span>.
              </p>
            </div>
          </div>

          {/* Thẻ chọn gói hành lý */}
          <h3 className="text-lg font-bold text-gray-900 mb-4">Chọn gói mua thêm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {baggagePackages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
                    isSelected 
                      ? "border-[#1d4ed8] bg-blue-50/50 shadow-md scale-[1.02]" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-[#1d4ed8] text-white rounded-full p-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{pkg.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{pkg.desc}</p>
                  <p className="font-bold text-[#da251d]">
                    {pkg.price === 0 ? "0 VND" : `+${pkg.price.toLocaleString('vi-VN')} VND`}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quy định tóm tắt */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-8">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              Quy định hành lý mua thêm
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-1">
              <li>Kích thước tối đa không vượt quá 158cm (dài + rộng + cao).</li>
              <li>Hành lý trả trước không được hoàn tiền và không được chuyển nhượng trong mọi trường hợp.</li>
            </ul>
          </div>

          {/* Xác nhận */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Xác nhận và Tiếp tục
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
