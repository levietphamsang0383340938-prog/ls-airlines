import { useState } from "react";
import { X, QrCode, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: (newBalance: number) => void;
}

export function DepositModal({ isOpen, onClose, userId, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [step, setStep] = useState<"SELECT_AMOUNT" | "QR_CODE" | "PROCESSING" | "SUCCESS">("SELECT_AMOUNT");
  const [isDepositing, setIsDepositing] = useState(false);

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  if (!isOpen) return null;

  const handleContinue = () => {
    if (amount >= 50000) {
      setStep("QR_CODE");
    }
  };

  const handleConfirmTransfer = async () => {
    setStep("PROCESSING");
    
    // Giả lập Webhook Delay 3 giây
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });

      if (response.ok) {
        const data = await response.json();
        setStep("SUCCESS");
        // Đợi 2 giây báo thành công rồi đóng modal
        setTimeout(() => {
          onSuccess(data.newBalance);
          onClose();
          // Reset form cho lần mở sau
          setTimeout(() => {
            setStep("SELECT_AMOUNT");
            setAmount(0);
          }, 500);
        }, 2000);
      } else {
        alert("Có lỗi xảy ra, vui lòng liên hệ CSKH.");
        setStep("QR_CODE");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối.");
      setStep("QR_CODE");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#005f73] px-6 py-4 flex items-center justify-between text-white">
          <h3 className="font-bold text-lg">Nạp tiền vào LS Wallet</h3>
          {step !== "PROCESSING" && step !== "SUCCESS" && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "SELECT_AMOUNT" && (
            <div>
              <p className="text-gray-600 mb-4 text-sm">Chọn mệnh giá hoặc nhập số tiền muốn nạp (Tối thiểu 50.000 VNĐ)</p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`py-2 px-1 text-sm font-medium rounded-xl border ${
                      amount === val 
                      ? "border-[#005f73] bg-[#005f73]/5 text-[#005f73]" 
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {val.toLocaleString()}đ
                  </button>
                ))}
              </div>

              <div className="mb-6 relative">
                <input 
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Nhập số tiền khác..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] outline-none text-lg font-semibold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">VNĐ</span>
              </div>

              <button 
                onClick={handleContinue}
                disabled={amount < 50000}
                className="w-full py-3.5 rounded-xl bg-[#005f73] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#004d61] transition-colors"
              >
                Tiếp tục
              </button>
            </div>
          )}

          {step === "QR_CODE" && (
            <div className="text-center">
              <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg mb-4 text-left font-medium flex gap-2">
                <QrCode className="w-5 h-5 shrink-0" />
                Quét mã QR qua ứng dụng Ngân hàng/Ví điện tử để thanh toán.
              </div>
              
              <div className="bg-white border-2 border-gray-100 rounded-xl p-4 inline-block shadow-sm mb-4">
                {/* Dùng ảnh placeholder vuông làm mock QR Code */}
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex flex-col items-center justify-center border-4 border-[#005f73]">
                  <QrCode className="w-20 h-20 text-[#005f73]" />
                  <span className="text-xs text-gray-500 mt-2 font-mono">Mock VietQR</span>
                </div>
              </div>

              <div className="text-left bg-gray-50 p-4 rounded-xl text-sm mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngân hàng:</span>
                  <span className="font-semibold">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chủ tài khoản:</span>
                  <span className="font-semibold">LS AIRLINES JSC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tiền:</span>
                  <span className="font-bold text-[#005f73] text-lg">{amount.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nội dung:</span>
                  <span className="font-mono bg-yellow-100 px-2 rounded text-yellow-800">NAP {userId.slice(-6).toUpperCase()}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmTransfer}
                className="w-full py-3.5 rounded-xl bg-[#005f73] text-white font-bold hover:bg-[#004d61] transition-colors shadow-md"
              >
                Tôi đã chuyển khoản
              </button>
              
              <button 
                onClick={() => setStep("SELECT_AMOUNT")}
                className="w-full py-2 mt-2 rounded-xl text-gray-500 font-medium hover:bg-gray-100 transition-colors"
              >
                Quay lại
              </button>
            </div>
          )}

          {step === "PROCESSING" && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-16 h-16 text-[#005f73] animate-spin mb-6" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Đang xử lý giao dịch...</h4>
              <p className="text-gray-500 text-center text-sm px-4">
                Hệ thống đang chờ tín hiệu xác nhận từ ngân hàng (Webhook). Vui lòng không đóng cửa sổ này.
              </p>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Nạp tiền thành công!</h4>
              <p className="text-gray-500 text-center text-sm px-4 mb-6">
                Số tiền <span className="font-bold text-green-600">{amount.toLocaleString()} VNĐ</span> đã được cộng vào Ví LS Wallet của bạn.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
