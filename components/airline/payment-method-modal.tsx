"use client";

import { useState } from "react";
import { X, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethodModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PaymentMethodModal({ isOpen, onClose }: PaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!isOpen) return null;

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic lưu thẻ vào Database tại đây sau này
    alert("Thêm thẻ thành công!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-[#005f73]">
            <CreditCard className="h-6 w-6" />
            <h2 className="text-xl font-bold">Thêm thẻ thanh toán</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form thêm thẻ */}
        <form onSubmit={handleSaveCard} className="space-y-4 text-gray-800">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Số thẻ *
            </label>
            <input
              type="text"
              required
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên in trên thẻ *
            </label>
            <input
              type="text"
              required
              placeholder="NGUYEN VAN A"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 uppercase outline-none transition-all focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ngày hết hạn *
              </label>
              <input
                type="text"
                required
                maxLength={5}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                CVV *
              </label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-[#005f73] focus:ring-2 focus:ring-[#005f73]/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-sm text-gray-500">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>Thông tin thẻ của bạn được bảo mật tuyệt đối.</span>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-6 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#005f73] px-6 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-[#004a5a]"
            >
              Lưu thẻ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}