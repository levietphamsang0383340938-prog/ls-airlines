import { Star, ArrowRight, Check, X, ShieldCheck, MonitorPlay, Sofa, Briefcase } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Hạng Phổ thông đặc biệt (Premium Economy) | LS Airlines",
  description: "Trải nghiệm không gian thoải mái hơn với chi phí hợp lý trên chuyến bay cùng LS Airlines.",
}

export default function PremiumEconomyPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d14eb508?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#004f61]/95 to-[#005f73]/70 z-10"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-left text-white max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/10 backdrop-blur-md border border-cyan-100/30 text-cyan-50 text-sm font-semibold mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Sự nâng cấp hoàn hảo</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Phổ thông Đặc biệt <br/> <span className="font-light opacity-90 text-3xl md:text-4xl">(Premium Economy)</span>
          </h1>
          <p className="text-lg lg:text-xl text-cyan-50 max-w-2xl leading-relaxed mt-6">
            Phân khúc nằm giữa, dành cho người muốn tận hưởng sự thoải mái, tiện nghi vượt trội hơn Hạng Phổ thông nhưng với chi phí tối ưu hơn Hạng Thương gia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 max-w-5xl -mt-16 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Sự khác biệt về không gian */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-cyan-100 text-[#005f73] rounded-2xl flex items-center justify-center mb-6">
              <Sofa className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Không gian thoải mái hơn</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tận hưởng sự rộng rãi tối đa trên những chặng bay dài với thiết kế ghế ngồi tối ưu hóa diện tích cho hành khách.
            </p>
            <ul className="space-y-4 flex-1 text-gray-600 font-medium">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Khoảng cách để chân rộng hơn <strong className="text-cyan-700">15% - 20%</strong> so với hạng Phổ thông.</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Độ ngả lưng sâu hơn, thiết kế tựa đầu và giá đỡ chân tùy chỉnh.</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Khoảng cách giữa các ghế (pitch) lên đến 38 inch.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Tiện ích gia tăng */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Tiện ích gia tăng</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Bạn được chăm sóc chu đáo hơn với các đặc quyền ưu tiên từ khi làm thủ tục đến khi ở trên không trung.
            </p>
            <ul className="space-y-4 flex-1 text-gray-600 font-medium">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-gray-800">Ưu tiên mặt đất:</strong> Làm thủ tục tại quầy riêng, ưu tiên lên máy bay (Boarding).</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-gray-800">Tiện nghi cá nhân:</strong> Tặng kèm bộ đồ dùng cá nhân (Amenity kit) cao cấp.</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span><strong className="text-gray-800">Giải trí:</strong> Màn hình giải trí cá nhân kích thước lớn hơn (11 - 13 inch) sắc nét.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bảng so sánh (Comparison Table) */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004f61]">Bảng So Sánh Các Hạng Vé</h2>
            <p className="text-gray-500 mt-2">Dễ dàng lựa chọn hạng ghế phù hợp nhất với nhu cầu của bạn</p>
          </div>

          <div className="overflow-x-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-1/4 p-6 bg-gray-50 text-gray-400 font-medium text-sm uppercase tracking-wider border-b border-gray-100">
                    Đặc điểm
                  </th>
                  <th className="w-1/4 p-6 border-b border-gray-100 text-center">
                    <div className="font-bold text-gray-700 text-lg">Phổ thông</div>
                    <div className="text-xs text-gray-400 font-normal mt-1">Tiết kiệm</div>
                  </th>
                  <th className="w-1/4 p-6 border-b-2 border-[#005f73] bg-[#f0f9fa] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#005f73]"></div>
                    <div className="font-bold text-[#005f73] text-lg">Phổ thông Đặc biệt</div>
                    <div className="text-xs text-[#0a9396] font-normal mt-1 flex justify-center items-center gap-1">
                      <Star className="w-3 h-3 fill-[#0a9396]" /> Lựa chọn tối ưu
                    </div>
                  </th>
                  <th className="w-1/4 p-6 border-b border-gray-100 text-center">
                    <div className="font-bold text-yellow-600 text-lg">Thương gia</div>
                    <div className="text-xs text-yellow-500 font-normal mt-1">Cao cấp</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row: Ghế ngồi */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-medium text-gray-800 flex items-center gap-3">
                    <Sofa className="w-5 h-5 text-gray-400" /> Không gian ghế
                  </td>
                  <td className="p-6 text-center text-gray-600 text-sm">Tiêu chuẩn (Pitch 31")</td>
                  <td className="p-6 text-center font-semibold text-[#005f73] bg-[#f0f9fa]/50 text-sm">Rộng rãi (Pitch 38")</td>
                  <td className="p-6 text-center text-gray-600 text-sm">Giường nằm 180° (Flat-bed)</td>
                </tr>
                {/* Row: Hành lý */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-medium text-gray-800 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" /> Hành lý ký gửi
                  </td>
                  <td className="p-6 text-center text-gray-600 text-sm">1 kiện 23kg</td>
                  <td className="p-6 text-center font-semibold text-[#005f73] bg-[#f0f9fa]/50 text-sm">1-2 kiện 23kg (tùy chặng)</td>
                  <td className="p-6 text-center text-gray-600 text-sm">2 kiện 32kg</td>
                </tr>
                {/* Row: Ưu tiên thủ tục */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-medium text-gray-800 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-400" /> Thủ tục/Lên máy bay
                  </td>
                  <td className="p-6 text-center">
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  </td>
                  <td className="p-6 text-center bg-[#f0f9fa]/50">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                    <div className="text-xs text-[#005f73] mt-1">Quầy riêng/Ưu tiên nhẹ</div>
                  </td>
                  <td className="p-6 text-center">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                    <div className="text-xs text-gray-500 mt-1">SkyPriority toàn diện</div>
                  </td>
                </tr>
                {/* Row: Màn hình giải trí */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-medium text-gray-800 flex items-center gap-3">
                    <MonitorPlay className="w-5 h-5 text-gray-400" /> Giải trí
                  </td>
                  <td className="p-6 text-center text-gray-600 text-sm">Màn hình 9-10"</td>
                  <td className="p-6 text-center font-semibold text-[#005f73] bg-[#f0f9fa]/50 text-sm">Màn hình lớn 11-13"</td>
                  <td className="p-6 text-center text-gray-600 text-sm">Màn hình siêu lớn 15"+</td>
                </tr>
                {/* Row: Hoàn đổi vé */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-medium text-gray-800 flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-gray-400" /> Hoàn / Đổi vé
                  </td>
                  <td className="p-6 text-center text-gray-600 text-sm">Mất phí (Không hoàn vé rẻ)</td>
                  <td className="p-6 text-center font-semibold text-[#005f73] bg-[#f0f9fa]/50 text-sm">Phí thấp hơn / Linh hoạt</td>
                  <td className="p-6 text-center text-gray-600 text-sm">Miễn phí hoặc phí rất thấp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-[#004f61] rounded-3xl p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Nâng cấp sự thoải mái cho chuyến bay dài</h2>
            <p className="text-cyan-100 mb-8 text-lg">
              Giá trị vượt trội với mức phí hoàn toàn hợp lý. Hãy chọn Phổ thông Đặc biệt cho hành trình sắp tới của bạn.
            </p>
            <Link 
              href="/?class=premium-economy"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#004f61] font-bold text-lg px-8 py-4 rounded-full hover:bg-cyan-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
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
