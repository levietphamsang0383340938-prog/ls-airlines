import { Star, Crown, Briefcase, Coffee, ShieldCheck, ArrowRight, CheckCircle2, MapPin, PlaneTakeoff } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Hạng Thương gia (Business) | LS Airlines",
  description: "Trải nghiệm đỉnh cao cùng Hạng Thương gia của LS Airlines - Đặc quyền mặt đất và trải nghiệm trên khoang đẳng cấp.",
}

export default function BusinessClassPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-20">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-[pulse_20s_ease-in-out_infinite]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540339832862-27429188e999?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#002f3a]/95 via-[#004f61]/80 to-transparent z-10"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-left text-white max-w-6xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-400/50 text-yellow-400 text-sm font-bold mb-6 tracking-wider uppercase">
            <Crown className="w-4 h-4" />
            <span>Đẳng Cấp Thương Gia</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
            Hạng Thương Gia <br/> <span className="font-light text-yellow-400/90">(Business Class)</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed font-light border-l-4 border-yellow-400 pl-4">
            Được thiết kế để phục vụ nhóm khách hàng cao cấp, mang đến những giá trị vượt trội và trải nghiệm hoàn hảo từ dưới mặt đất lên tận tầng mây.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 max-w-6xl -mt-20 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Đặc quyền mặt đất */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#005f73] to-[#0a9396] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#004f61] mb-6">Đặc quyền mặt đất</h3>
            <ul className="space-y-5 flex-1 text-gray-600">
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Phòng chờ Thương gia:</strong> 
                  Không gian nghỉ ngơi yên tĩnh, ẩm thực cao cấp đa dạng trước giờ bay.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Lối đi ưu tiên (SkyPriority):</strong> 
                  Tiết kiệm thời gian tại cửa an ninh và cửa lên máy bay.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Quầy thủ tục riêng:</strong> 
                  Làm thủ tục nhanh chóng, được ưu tiên gắn thẻ hành lý.
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: Trải nghiệm trên khoang */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-500 group lg:-translate-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
              <PlaneTakeoff className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#004f61] mb-6">Trải nghiệm trên khoang</h3>
            <ul className="space-y-5 flex-1 text-gray-600">
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Ghế ngả phẳng (Flat-bed):</strong> 
                  Biến thành giường nằm 180 độ, tạo không gian riêng tư hoàn hảo.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Ẩm thực tinh hoa:</strong> 
                  Thực đơn được thiết kế bởi bếp trưởng 5 sao, phục vụ theo yêu cầu.
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Đồ uống đặc biệt:</strong> 
                  Thưởng thức các loại rượu vang thượng hạng, cocktail và thức uống pha chế.
                </div>
              </li>
            </ul>
          </div>

          {/* Card 3: Hạn mức hành lý */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-500 group">
            <div className="w-16 h-16 bg-gradient-to-br from-[#005f73] to-[#0a9396] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#004f61] mb-6">Hạn mức hành lý</h3>
            <ul className="space-y-5 flex-1 text-gray-600">
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Hành lý xách tay:</strong> 
                  Tối đa 2 kiện và 1 phụ kiện (tổng trọng lượng lên đến 18kg).
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Hành lý ký gửi:</strong> 
                  2 kiện, mỗi kiện tối đa 32kg (gấp đôi Hạng Phổ thông).
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <Star className="w-6 h-6 text-yellow-500 shrink-0 fill-yellow-500/20" />
                <div>
                  <strong className="text-gray-900 block mb-1">Bảo đảm hành lý:</strong> 
                  Hành lý được ưu tiên xử lý và chuyển ra băng chuyền đầu tiên.
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Lounge Image Banner */}
        <div className="mt-20 relative w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512453979436-5a536f1158a4?q=80&w=2070&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 text-white w-full">
            <h3 className="text-3xl font-bold mb-2">Phòng chờ Thương gia (Business Lounge)</h3>
            <p className="text-gray-300 max-w-3xl text-lg">
              Tận hưởng không gian sang trọng, dịch vụ ẩm thực đa dạng và sự riêng tư tuyệt đối trước giờ cất cánh tại hệ thống phòng chờ của chúng tôi.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl p-1 relative overflow-hidden shadow-2xl">
          <div className="bg-white rounded-[22px] p-12 text-center relative z-10 overflow-hidden">
            {/* Watermark logo effect */}
            <Crown className="absolute -right-10 -bottom-10 w-64 h-64 text-gray-50 opacity-50 -rotate-12" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#004f61] mb-4 relative z-10">Tận hưởng hành trình đẳng cấp</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto relative z-10">
              Nâng tầm trải nghiệm của bạn với Hạng Thương gia. Đặt chuyến bay ngay để nhận được các đặc quyền hoàn hảo nhất từ LS Airlines.
            </p>
            <Link 
              href="/?class=business"
              className="relative z-10 inline-flex items-center justify-center gap-2 bg-[#004f61] text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-[#003a47] hover:shadow-[0_10px_20px_rgba(0,79,97,0.3)] transition-all transform hover:-translate-y-1 duration-300"
            >
              Tìm chuyến bay Thương gia
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
