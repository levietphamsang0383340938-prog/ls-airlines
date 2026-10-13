import { Wifi, Smartphone, Globe, MessageCircle, Zap, Info, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Kết nối Internet trên chuyến bay (In-flight Wi-Fi) | LS Airlines",
  description: "Duy trì kết nối ngay cả khi ở trên độ cao 10.000 mét với dịch vụ Wi-Fi trên chuyến bay của LS Airlines.",
}

export default function InternetPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-[#004f61]/80 backdrop-blur-[2px] z-10"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white max-w-4xl mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/10 backdrop-blur-md border border-cyan-100/30 text-cyan-50 text-sm font-semibold mb-6">
            <Wifi className="w-4 h-4" />
            <span>Kết nối không giới hạn</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-md">
            Wi-Fi Trên Chuyến Bay
          </h1>
          <p className="text-lg lg:text-xl text-cyan-50 leading-relaxed drop-shadow max-w-2xl mx-auto">
            Duy trì kết nối với công việc, gia đình và bạn bè ngay cả khi bạn đang ở độ cao 10.000 mét. Khám phá các gói cước Wi-Fi linh hoạt của chúng tôi.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 max-w-5xl -mt-16 relative z-30">
        
        {/* Hướng dẫn 3 bước kết nối */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004f61]">Hướng dẫn kết nối 3 bước</h2>
            <p className="text-gray-500 mt-2">Nhanh chóng và dễ dàng để online ngay lập tức</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 w-2/3 h-0.5 bg-gray-100 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white border-4 border-[#005f73] text-[#005f73] rounded-full flex items-center justify-center mb-6 shadow-md relative">
                <Smartphone className="w-10 h-10" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bật chế độ máy bay</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Chuyển thiết bị của bạn sang Chế độ Máy bay (Airplane mode) ngay khi cửa máy bay đóng lại.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white border-4 border-[#005f73] text-[#005f73] rounded-full flex items-center justify-center mb-6 shadow-md relative">
                <Wifi className="w-10 h-10" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Kết nối Wi-Fi nội bộ</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Bật tính năng Wi-Fi trên thiết bị và chọn mạng <strong className="text-[#005f73]">"LS Airlines Wi-Fi"</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white border-4 border-[#005f73] text-[#005f73] rounded-full flex items-center justify-center mb-6 shadow-md relative">
                <Globe className="w-10 h-10" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Đăng nhập & Mua gói</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-4">
                Mở trình duyệt web. Hệ thống sẽ tự động chuyển hướng đến cổng thông tin để bạn chọn và mua gói cước.
              </p>
            </div>
          </div>
        </div>

        {/* Các gói cước truy cập */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004f61]">Gói cước đa dạng</h2>
            <p className="text-gray-500 mt-2">Phù hợp cho mọi nhu cầu kết nối của bạn trong suốt chuyến bay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Gói Chat */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="p-6 bg-slate-50 border-b border-gray-100 text-center">
                <div className="w-12 h-12 bg-cyan-100 text-[#005f73] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Gói Nhắn Tin</h3>
                <div className="text-3xl font-extrabold text-[#004f61] my-3">
                  $2.99
                  <span className="text-sm font-normal text-gray-500 block mt-1">hoặc miễn phí cho Thương gia</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 text-sm text-gray-600 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Hỗ trợ iMessage, WhatsApp, Messenger, Viber.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Gửi tin nhắn văn bản (Không hỗ trợ gửi ảnh/video).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Sử dụng suốt chuyến bay.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Gói Lướt web (Phổ biến) */}
            <div className="bg-white rounded-2xl border-2 border-[#005f73] overflow-hidden shadow-xl transform scale-100 md:scale-105 z-10 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-[#005f73]"></div>
              <div className="absolute top-4 right-[-30px] bg-yellow-400 text-xs font-bold px-10 py-1 rotate-45 text-[#004f61]">
                PHỔ BIẾN
              </div>
              <div className="p-6 bg-[#005f73] border-b border-gray-100 text-center text-white">
                <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-1">Gói Lướt Web 2 Giờ</h3>
                <div className="text-3xl font-extrabold my-3">
                  $9.99
                  <span className="text-sm font-normal text-cyan-100 block mt-1">giới hạn 2 giờ liên tục</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-white">
                <ul className="space-y-3 text-sm text-gray-600 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#005f73] shrink-0" />
                    <span>Lướt web, check email, mạng xã hội.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#005f73] shrink-0" />
                    <span>Tốc độ trung bình, phù hợp cho công việc nhẹ.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#005f73] shrink-0" />
                    <span>Hỗ trợ gửi hình ảnh cơ bản.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Gói Toàn chặng */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
              <div className="p-6 bg-slate-50 border-b border-gray-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Gói Toàn Chặng Premium</h3>
                <div className="text-3xl font-extrabold text-[#004f61] my-3">
                  $21.99
                  <span className="text-sm font-normal text-gray-500 block mt-1">không giới hạn thời gian</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 text-sm text-gray-600 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Sử dụng không giới hạn dung lượng trong toàn bộ chuyến bay.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Băng thông ưu tiên, hỗ trợ truyền tải video ngắn.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Kết nối VPN phục vụ công việc.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Lưu ý kỹ thuật */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
          <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Lưu ý quan trọng:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800/80">
              <li>Dịch vụ Wi-Fi chỉ khả dụng trên một số dòng máy bay thân rộng hiện đại (như Boeing 787, Airbus A350).</li>
              <li>Hệ thống chỉ bắt đầu kích hoạt và cho phép truy cập khi máy bay đã đạt đến <strong>độ cao ổn định (trên 10.000 feet)</strong>.</li>
              <li>Tốc độ mạng phụ thuộc vào tín hiệu vệ tinh và số lượng người cùng truy cập trên chuyến bay. Không hỗ trợ xem video trực tuyến (streaming) độ phân giải cao hoặc tải tập tin lớn.</li>
            </ul>
          </div>
        </div>

      </section>
    </div>
  )
}
