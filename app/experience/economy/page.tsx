import { Plane, Briefcase, Coffee, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Hạng Phổ thông (Economy) | LS Airlines",
  description: "Khám phá Hạng Phổ thông của LS Airlines - Hạng vé phổ biến nhất với tiện ích tối ưu và giá cả hợp lý.",
}

export default function EconomyClassPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#004f61]/90 to-[#004f61]/60 z-10"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center lg:text-left text-white max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold mb-6">
            <Plane className="w-4 h-4" />
            <span>Trải nghiệm bay</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight">Hạng Phổ thông <span className="font-light">(Economy)</span></h1>
          <p className="text-lg lg:text-xl text-cyan-50 max-w-2xl leading-relaxed">
            Hạng vé mặc định và phổ biến nhất của LS Airlines. Lựa chọn hoàn hảo với không gian thoải mái, đầy đủ tiện nghi tiêu chuẩn và mức giá tiết kiệm tối ưu.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 max-w-5xl -mt-16 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Thông số cơ bản */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-cyan-100 text-[#005f73] rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Thông số cơ bản</h3>
            <ul className="space-y-4 flex-1 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Hành lý xách tay:</strong> Tối đa 12kg (Bao gồm 1 kiện và 1 phụ kiện).</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Hành lý ký gửi:</strong> 1 kiện tối đa 23kg.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Ghế ngồi:</strong> Khoảng cách ghế 31-32 inch (78-81cm), độ ngả lưng tiêu chuẩn tạo sự thoải mái.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Dịch vụ đi kèm */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
              <Coffee className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Dịch vụ đi kèm</h3>
            <ul className="space-y-4 flex-1 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Suất ăn:</strong> Bữa ăn nóng tiêu chuẩn đa dạng thực đơn (áp dụng cho các chuyến bay trên 2 tiếng).</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Đồ uống:</strong> Phục vụ miễn phí nước tinh khiết, trà, cà phê và các loại nước ngọt suốt chuyến bay.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Chính sách */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Chính sách vé</h3>
            <ul className="space-y-4 flex-1 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Đổi vé:</strong> Cho phép đổi ngày bay/giờ bay (Có thu phí đổi và mức chênh lệch giá vé nếu có).</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-slate-800">Hoàn vé:</strong> Không được phép hoàn vé hoặc hoàn vé có phí (Tuỳ thuộc vào hạng Đặt chỗ Phổ thông Linh Hoạt hay Tiết Kiệm).</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-[#005f73] to-[#0a9396] rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng cất cánh cùng LS Airlines?</h2>
            <p className="text-cyan-100 mb-8 text-lg">
              Trải nghiệm chuyến bay thoải mái và tiết kiệm ngay hôm nay với Hạng Phổ thông.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-[#004f61] font-bold text-lg px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
            >
              Tìm chuyến bay ngay
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
