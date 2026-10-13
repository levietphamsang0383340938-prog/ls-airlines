import { MonitorPlay, Film, Music, Gamepad2, BookOpen, Baby, Smartphone, Tv } from "lucide-react"

export const metadata = {
  title: "Giải trí trên chuyến bay | LS Airlines",
  description: "Tận hưởng hàng ngàn giờ giải trí với phim ảnh, âm nhạc, và trò chơi trên các chuyến bay của LS Airlines.",
}

export default function EntertainmentPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=2074&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#002f3a]/90 via-[#004f61]/60 to-transparent z-10"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white max-w-4xl mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold mb-6">
            <MonitorPlay className="w-4 h-4" />
            <span>Tiện ích thư giãn</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-md">
            Giải Trí Trên Chuyến Bay
          </h1>
          <p className="text-lg lg:text-xl text-cyan-50 leading-relaxed drop-shadow">
            Thế giới giải trí vô tận ngay tại ghế ngồi của bạn. Tận hưởng hàng ngàn giờ phim bom tấn, album nhạc đỉnh cao và các trò chơi thú vị.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 max-w-6xl -mt-16 relative z-30">
        
        {/* Section: Thiết bị hỗ trợ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004f61]">Lựa chọn thiết bị hiển thị</h2>
            <p className="text-gray-500 mt-2">Truy cập hệ thống giải trí đa phương tiện theo cách của riêng bạn</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#f0f9fa] text-[#005f73] rounded-full flex items-center justify-center mb-6">
                <Tv className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Màn hình cá nhân (Seatback)</h3>
              <p className="text-gray-600">
                Tích hợp sẵn ngay sau lưng ghế phía trước. Màn hình cảm ứng độ phân giải cao từ 10 inch đến 15 inch (tùy hạng ghế) với giao diện trực quan, dễ dàng thao tác.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-cyan-50 text-[#005f73] rounded-full flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Thiết bị di động cá nhân (Wireless)</h3>
              <p className="text-gray-600">
                Trên một số tàu bay hiện đại, bạn có thể kết nối điện thoại hoặc máy tính bảng vào mạng nội bộ (Intranet) của máy bay để xem trực tiếp kho nội dung trên trình duyệt.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Danh mục nội dung */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004f61]">Khám phá kho nội dung</h2>
            <p className="text-gray-500 mt-2">Hàng trăm lựa chọn được cập nhật hàng tháng để chuyến đi của bạn không bao giờ nhàm chán</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Phim ảnh */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
              <div className="h-40 bg-[#004f61] relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-12 h-12 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Phim ảnh & Truyền hình</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Từ các bom tấn Hollywood mới nhất, điện ảnh Châu Á đặc sắc đến các series phim truyền hình và phim tài liệu ăn khách.
                </p>
              </div>
            </div>

            {/* Âm nhạc */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
              <div className="h-40 bg-[#0a9396] relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-12 h-12 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Âm nhạc & Podcast</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Thư giãn với hàng trăm album nhạc thuộc mọi thể loại từ Pop, Ballad đến Giao hưởng, hoặc nghe các kênh Podcast truyền cảm hứng.
                </p>
              </div>
            </div>

            {/* Trò chơi */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
              <div className="h-40 bg-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gamepad2 className="w-12 h-12 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Trò chơi tương tác</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lựa chọn phong phú từ các game trí tuệ, giải đố đến game hành động và thẻ bài có thể chơi trực tiếp trên màn hình cảm ứng.
                </p>
              </div>
            </div>

            {/* Tạp chí */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
              <div className="h-40 bg-amber-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Tạp chí điện tử</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cập nhật tin tức thế giới, kinh doanh, thời trang và du lịch qua thư viện tạp chí điện tử (e-magazine) đa ngôn ngữ.
                </p>
              </div>
            </div>

            {/* Thiếu nhi */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
              <div className="h-40 bg-rose-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Baby className="w-12 h-12 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Góc Thiếu nhi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Giữ cho các thiên thần nhỏ luôn vui vẻ với các bộ phim hoạt hình vui nhộn, kênh âm nhạc và những trò chơi an toàn, phù hợp lứa tuổi.
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  )
}
