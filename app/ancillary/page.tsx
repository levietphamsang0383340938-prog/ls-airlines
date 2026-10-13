"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ChevronLeft, Plane, Luggage, Utensils, ShieldCheck, Armchair, ArrowRight, CheckCircle2, X, Plus, Car } from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
const BAGGAGE_OPTIONS = [
  { weight: 20, price: 200000 },
  { weight: 30, price: 300000 },
  { weight: 40, price: 400000 },
  { weight: 50, price: 550000 },
  { weight: 60, price: 650000 },
  { weight: 70, price: 750000 },
];

const MEAL_OPTIONS = [
  { id: "m1", name: "Combo Penalty Soda Dâu và Hạt Macca", price: 100000, img: "https://placehold.co/150x100/eaaa00/white?text=Soda+Dau" },
  { id: "m2", name: "Combo Hattrick", price: 110000, img: "https://placehold.co/150x100/eaaa00/white?text=Hattrick" },
  { id: "m3", name: "Combo Mỳ Ý và Nước suối", price: 119000, img: "https://placehold.co/150x100/eaaa00/white?text=My+Y" },
  { id: "m4", name: "Combo Cơm chiên Thái và Nước suối", price: 119000, img: "https://placehold.co/150x100/eaaa00/white?text=Com+Thai" },
];

const TAXI_OPTIONS = [
  { id: "t1", name: "Green SM Premium", desc: "Gói 30 Km • 4 seats", price: 450000, img: "https://placehold.co/100x60/006079/white?text=GSM" }
];

function AncillaryContent() {
  const searchParams = useSearchParams();
  
  // States cho các Modal và Lựa chọn
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedBaggage, setSelectedBaggage] = useState<number>(0);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string>("");
  const [selectedTaxi, setSelectedTaxi] = useState<string>("");
  const [hasInsurance, setHasInsurance] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy dữ liệu từ URL
  const flightId = searchParams.get("flightId") || "VN7151";
  const from = searchParams.get("from") || "HAN";
  const to = searchParams.get("to") || "SGN";
  const date = searchParams.get("date") || "2026-08-27";
  const pkg = searchParams.get("package") || "Phổ thông";
  const basePriceStr = searchParams.get("price") || "0 VND";
  const paxStr = searchParams.get("pax") || "1";
  const pax = parseInt(paxStr);
  const fullName = searchParams.get("fullName") || "Khách hàng";

  // Hàm tính toán tiền
  const parsePrice = (str: string) => parseInt(str.replace(/[^\d]/g, "")) || 0;
  const basePrice = parsePrice(basePriceStr);
  const formatVND = (amount: number) => amount.toLocaleString("vi-VN") + " VND";
  
  // Tính giá từng dịch vụ
  const baggagePrice = BAGGAGE_OPTIONS.find(b => b.weight === selectedBaggage)?.price || 0;
  const mealPrice = selectedMeals.reduce((acc, mealId) => {
    const meal = MEAL_OPTIONS.find(m => m.id === mealId);
    return acc + (meal ? meal.price : 0);
  }, 0);
  
  const getSeatPrice = (seatCode: string) => {
    if (!seatCode) return 0;
    const row = parseInt(seatCode.replace(/[^\d]/g, ""));
    if (row <= 5) return 250000;
    if (row <= 10) return 150000;
    return 100000;
  };
  const seatPrice = getSeatPrice(selectedSeat);
  const taxiPrice = TAXI_OPTIONS.find(t => t.id === selectedTaxi)?.price || 0;
  const INSURANCE_PRICE = 44000;

  // Tính tổng
  const totalAncillaryPerPax = baggagePrice + mealPrice + seatPrice + (hasInsurance ? INSURANCE_PRICE : 0);
  const totalAncillaryAll = (totalAncillaryPerPax * pax) + taxiPrice;
  const totalPrice = basePrice + totalAncillaryAll;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const extras = [];
    if (selectedBaggage > 0) extras.push(`Hành lý ${selectedBaggage}kg`);
    if (selectedMeals.length > 0) extras.push(`Suất ăn (${selectedMeals.length})`);
    if (selectedSeat) extras.push(`Ghế ${selectedSeat}`);
    if (hasInsurance) extras.push("Bảo hiểm");
    if (selectedTaxi) extras.push("Taxi");
    
    const finalPkg = extras.length > 0 ? `${pkg} + ${extras.join(", ")}` : pkg;

    try {
      const response = await fetch('/api/booking/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId, from, to, date, pax,
          pkg: finalPkg,
          price: formatVND(totalPrice),
          fullName: searchParams.get("fullName") || "Khách hàng",
          dob: searchParams.get("dob") || "2000-01-01",
          idNumber: searchParams.get("idNumber") || "000000000",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("package", finalPkg || "");
        params.set("price", formatVND(totalPrice));
        params.set("bookingId", data.bookingId);
        window.location.href = `/checkout?${params.toString()}`;
      } else {
        alert(data.error || "Có lỗi xảy ra khi tạo đặt vé");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi tạo đặt vé");
      setIsSubmitting(false);
    }
  };

  // --- UI COMPONENTS ---
  const ServiceOpenerCard = ({ icon: Icon, title, desc, price, isActive, onClick }: any) => (
    <div 
      className={`bg-white rounded-xl border-2 transition-all p-4 flex items-center justify-between cursor-pointer group ${
        isActive ? 'border-[#006079] shadow-md bg-[#006079]/5' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-3 rounded-full ${isActive ? 'bg-[#eaaa00] text-[#006079]' : 'bg-gray-100 text-[#006079] group-hover:bg-gray-200'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <span className="font-bold text-[#006079]">{price > 0 ? formatVND(price) : ""}</span>
        <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
      </div>
    </div>
  );

  const Modal = ({ title, isOpen, onClose, children, total }: any) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#006079] text-white p-4 flex justify-between items-center shrink-0">
            <h2 className="font-bold text-lg uppercase tracking-wide">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
            {children}
          </div>
          <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div>
              <p className="text-xs text-gray-500">Tạm tính</p>
              <div className="font-bold text-xl text-[#006079]">{total > 0 ? formatVND(total) : "0 VND"}</div>
            </div>
            <button onClick={onClose} className="bg-[#eaaa00] text-[#006079] font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-md">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-24 pb-16">
      <div className="max-w-6xl w-full px-4 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: SERVICES */}
        <div className="flex-1 space-y-4">
          <div className="bg-[#eaaa00] rounded-xl p-4 mb-2 shadow-sm">
             <h1 className="text-xl md:text-2xl font-bold text-[#006079] uppercase">
               Đừng quên mua hành lý, suất ăn, chọn chỗ ngồi và hơn thế nữa...
             </h1>
          </div>

          <ServiceOpenerCard 
            icon={Armchair} 
            title="Chọn chỗ ngồi yêu thích" 
            desc={selectedSeat ? `Ghế đã chọn: ${selectedSeat}` : "Hãy chọn chỗ ngồi yêu thích của bạn"}
            price={seatPrice} 
            isActive={!!selectedSeat} 
            onClick={() => setActiveModal('seat')} 
          />
          
          <ServiceOpenerCard 
            icon={Luggage} 
            title="Chọn hành lý / Dịch vụ nối chuyến" 
            desc={selectedBaggage > 0 ? `${from} ✈ ${to} • Gói ${selectedBaggage}kg` : "Hãy lựa chọn gói hành lý phù hợp"} 
            price={baggagePrice} 
            isActive={selectedBaggage > 0} 
            onClick={() => setActiveModal('baggage')} 
          />

          <ServiceOpenerCard 
            icon={Utensils} 
            title="Chọn suất ăn" 
            desc={selectedMeals.length > 0 ? `Đã chọn ${selectedMeals.length} suất ăn` : "Thực đơn phong phú"} 
            price={mealPrice} 
            isActive={selectedMeals.length > 0} 
            onClick={() => setActiveModal('meal')} 
          />

          <ServiceOpenerCard 
            icon={Car} 
            title="Dịch vụ Taxi" 
            desc={selectedTaxi ? "Green SM Premium" : "Đặt taxi đón tiễn sân bay"} 
            price={taxiPrice} 
            isActive={!!selectedTaxi} 
            onClick={() => setActiveModal('taxi')} 
          />

          {/* Insurance Toggle is direct */}
          <div 
            className={`bg-white rounded-xl border-2 transition-all p-4 flex items-center justify-between cursor-pointer ${
              hasInsurance ? 'border-[#006079] shadow-md bg-[#006079]/5' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setHasInsurance(!hasInsurance)}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-3 rounded-full ${hasInsurance ? 'bg-[#eaaa00] text-[#006079]' : 'bg-gray-100 text-[#006079]'}`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">Bảo hiểm du lịch Travel Safe</h3>
                <p className="text-xs text-gray-500 mt-1">Giấy chứng nhận bảo hiểm được cấp cùng vé máy bay.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 ml-4">
              <span className="font-bold text-[#006079]">{formatVND(INSURANCE_PRICE)}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                hasInsurance ? 'border-[#006079] bg-[#006079]' : 'border-gray-300'
              }`}>
                {hasInsurance && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
            <div className="bg-[#006079] text-white p-4 flex justify-between items-center">
              <h2 className="font-bold text-lg uppercase">Thông tin đặt chỗ</h2>
              <button 
                onClick={() => setActiveModal('details')}
                className="bg-[#eaaa00] text-[#006079] text-xs font-bold px-3 py-1 rounded hover:bg-yellow-400 transition-colors"
              >
                Chi tiết
              </button>
            </div>

            <div className="p-4 bg-[#eef5f8] border-b border-gray-200 text-center">
               <div className="text-xs font-bold text-gray-500 uppercase">Người lớn</div>
               <div className="font-black text-[#006079] uppercase">{fullName}</div>
               <div className="text-xs font-bold mt-1 text-gray-700">{from} - {to}</div>
               {selectedBaggage > 0 && <div className="text-xs text-[#006079] font-bold mt-1 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> Bạn đã mua gói {selectedBaggage}kg</div>}
            </div>

            <div className="p-4 space-y-3 border-b border-gray-200 bg-white">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Giá vé gốc (x{pax})</span>
                <span className="font-semibold text-gray-800">{formatVND(basePrice)}</span>
              </div>
              
              {seatPrice > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ghế {selectedSeat} (x{pax})</span>
                  <span className="font-semibold text-gray-800">{formatVND(seatPrice * pax)}</span>
                </div>
              )}
              {selectedBaggage > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Hành lý {selectedBaggage}kg (x{pax})</span>
                  <span className="font-semibold text-gray-800">{formatVND(baggagePrice * pax)}</span>
                </div>
              )}
              {mealPrice > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Suất ăn (x{pax})</span>
                  <span className="font-semibold text-gray-800">{formatVND(mealPrice * pax)}</span>
                </div>
              )}
              {hasInsurance && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Bảo hiểm (x{pax})</span>
                  <span className="font-semibold text-gray-800">{formatVND(INSURANCE_PRICE * pax)}</span>
                </div>
              )}
              {taxiPrice > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Dịch vụ Taxi</span>
                  <span className="font-semibold text-gray-800">{formatVND(taxiPrice)}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#006079] text-white flex justify-between items-center">
              <span className="font-bold uppercase">Tổng tiền</span>
              <span className="text-xl font-black text-white">{formatVND(totalPrice)}</span>
            </div>

            <div className="p-4 bg-gray-50 flex gap-2">
              <Link href="/passenger" className="flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                Quay lại
              </Link>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-[2] bg-[#eaaa00] text-[#006079] font-bold py-3 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "Đi tiếp"}
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* --- MODALS --- */}
      
      {/* SEAT MODAL */}
      <Modal title="Chọn chỗ ngồi" isOpen={activeModal === 'seat'} onClose={() => setActiveModal(null)} total={seatPrice}>
        <div className="flex flex-col items-center">
           <div className="flex gap-4 mb-6 text-[11px] font-bold justify-center flex-wrap bg-white p-3 rounded-lg shadow-sm w-full">
              <div className="flex items-center gap-1"><div className="w-4 h-4 bg-yellow-500 rounded"></div> Ghế cao cấp</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 bg-[#006079] rounded"></div> Phía trước</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 bg-[#41b5d1] rounded"></div> Tiêu chuẩn</div>
           </div>
           
           <div className="bg-gray-200 p-2 rounded-t-full w-full max-w-[320px] h-12 mb-2 relative overflow-hidden">
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-400 font-bold text-xs uppercase">Buồng lái</div>
           </div>
           
           <div className="bg-gray-100 py-6 px-4 w-full max-w-[320px] border-x-4 border-gray-300 shadow-inner">
             {[...Array(26)].map((_, i) => {
               const row = i + 1;
               const isPremium = row <= 5;
               const isFront = row > 5 && row <= 10;
               return (
                 <div key={row} className="flex justify-between items-center mb-2.5">
                   <div className="flex gap-1.5">
                     {['A', 'B', 'C'].map(col => {
                       const code = `${row}${col}`;
                       const isSelected = selectedSeat === code;
                       return (
                         <button key={code} onClick={() => setSelectedSeat(isSelected ? "" : code)} className={`w-9 h-10 rounded-t-lg rounded-b-sm text-[10px] font-bold flex items-center justify-center transition-all ${isSelected ? 'bg-yellow-400 text-[#006079] border-2 border-[#006079] scale-110 shadow-md' : isPremium ? 'bg-yellow-500 text-white hover:bg-yellow-600' : isFront ? 'bg-[#006079] text-white hover:bg-[#004d61]' : 'bg-[#41b5d1] text-white hover:bg-[#2fa3be]'}`}>
                           {isSelected ? code : ""}
                         </button>
                       )
                     })}
                   </div>
                   <div className="w-8 text-center text-xs font-black text-gray-500">{row}</div>
                   <div className="flex gap-1.5">
                     {['D', 'E', 'F'].map(col => {
                       const code = `${row}${col}`;
                       const isSelected = selectedSeat === code;
                       return (
                         <button key={code} onClick={() => setSelectedSeat(isSelected ? "" : code)} className={`w-9 h-10 rounded-t-lg rounded-b-sm text-[10px] font-bold flex items-center justify-center transition-all ${isSelected ? 'bg-yellow-400 text-[#006079] border-2 border-[#006079] scale-110 shadow-md' : isPremium ? 'bg-yellow-500 text-white hover:bg-yellow-600' : isFront ? 'bg-[#006079] text-white hover:bg-[#004d61]' : 'bg-[#41b5d1] text-white hover:bg-[#2fa3be]'}`}>
                           {isSelected ? code : ""}
                         </button>
                       )
                     })}
                   </div>
                 </div>
               )
             })}
           </div>
        </div>
      </Modal>

      {/* BAGGAGE MODAL */}
      <Modal title="Chọn hành lý" isOpen={activeModal === 'baggage'} onClose={() => setActiveModal(null)} total={baggagePrice}>
        <div className="mb-4 bg-[#eef5f8] text-[#006079] p-3 rounded-lg text-sm font-bold flex items-center gap-2 border border-[#006079]/20">
           <CheckCircle2 className="w-5 h-5" /> Hạng vé của bạn đã bao gồm 7kg hành lý xách tay
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button onClick={() => setSelectedBaggage(0)} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 bg-white transition-all ${selectedBaggage === 0 ? 'border-[#006079] shadow-md bg-[#006079]/5' : 'border-gray-200 hover:border-gray-300'}`}>
             <span className="font-bold text-gray-700">Không mua</span>
             {selectedBaggage === 0 && <CheckCircle2 className="w-5 h-5 text-[#006079]" />}
          </button>
          {BAGGAGE_OPTIONS.map(opt => (
            <button key={opt.weight} onClick={() => setSelectedBaggage(opt.weight)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 bg-white transition-all ${selectedBaggage === opt.weight ? 'border-[#006079] shadow-md bg-[#006079]/5' : 'border-gray-200 hover:border-gray-300'}`}>
               <Luggage className={`w-8 h-8 ${selectedBaggage === opt.weight ? 'text-[#006079]' : 'text-[#eaaa00]'}`} />
               <span className="font-bold text-gray-700">Gói {opt.weight}kg</span>
               <span className="text-[#006079] font-bold text-sm">{formatVND(opt.price)}</span>
               {selectedBaggage === opt.weight ? <CheckCircle2 className="w-5 h-5 text-[#006079]" /> : <Plus className="w-5 h-5 text-gray-300" />}
            </button>
          ))}
        </div>
      </Modal>

      {/* MEAL MODAL */}
      <Modal title="Chọn suất ăn" isOpen={activeModal === 'meal'} onClose={() => setActiveModal(null)} total={mealPrice}>
        <div className="space-y-3">
          {MEAL_OPTIONS.map(meal => {
            const isSelected = selectedMeals.includes(meal.id);
            return (
              <div key={meal.id} className={`flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden border-2 transition-all ${isSelected ? 'border-[#006079] shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <img src={meal.img} alt={meal.name} className="w-full sm:w-40 h-32 object-cover" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{meal.name}</h4>
                    <p className="text-[#006079] font-bold mt-1 text-lg">{formatVND(meal.price)}</p>
                  </div>
                  <div className="self-end mt-2 sm:mt-0">
                    <button 
                      onClick={() => setSelectedMeals(prev => isSelected ? prev.filter(id => id !== meal.id) : [...prev, meal.id])}
                      className={`flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-full transition-colors ${isSelected ? 'bg-[#006079]/10 text-[#006079] border border-[#006079]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {isSelected ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                      {isSelected ? "Bỏ chọn" : "Chọn thêm"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      {/* TAXI MODAL */}
      <Modal title="Dịch vụ Taxi" isOpen={activeModal === 'taxi'} onClose={() => setActiveModal(null)} total={taxiPrice}>
        <div className="space-y-4">
          <div className="w-full bg-[#006079]/10 rounded-xl p-4 overflow-hidden relative mb-4 flex items-center justify-center h-32">
             <div className="absolute inset-0 bg-[#006079] opacity-90"></div>
             <h3 className="relative z-10 text-[#eaaa00] font-black text-xl md:text-2xl text-center uppercase">Chuyến bay đẳng cấp<br/>Đón tiễn thảnh thơi</h3>
          </div>
          <p className="text-sm text-gray-600 px-1">E-Voucher sẽ được Green SM gửi đến quý khách qua email đăng ký khi mua vé.</p>
          
          {TAXI_OPTIONS.map(taxi => {
            const isSelected = selectedTaxi === taxi.id;
            return (
              <div key={taxi.id} onClick={() => setSelectedTaxi(isSelected ? "" : taxi.id)} className={`cursor-pointer flex items-center bg-white rounded-xl border-2 p-4 transition-all ${isSelected ? 'border-[#006079] shadow-md bg-[#006079]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <img src={taxi.img} alt={taxi.name} className="w-16 h-16 object-contain rounded" />
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-gray-800">{taxi.name}</h4>
                  <p className="text-gray-500 text-xs mt-1">{taxi.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[#006079] font-bold text-lg">{formatVND(taxi.price)}</span>
                   <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#006079] bg-[#006079]' : 'border-gray-300'}`}>
                     {isSelected ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-gray-400" />}
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      {/* DETAILS MODAL */}
      <Modal title="Chi tiết hành khách" isOpen={activeModal === 'details'} onClose={() => setActiveModal(null)} total={totalPrice}>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
             <span className="font-bold text-gray-800">Người lớn: Mr/Ms {fullName.toUpperCase()}</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
               <div className="font-bold text-[#006079] text-sm">
                 {from} ✈ {to}
               </div>
               <div className="text-xs text-gray-600 mt-1">
                 {selectedBaggage > 0 ? `Hành lý ký gửi: Gói ${selectedBaggage}kg` : "Không có hành lý ký gửi"}
               </div>
            </div>

            <h3 className="font-bold text-green-600 uppercase text-sm border-b border-gray-200 pb-2">Chi tiết</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-bold text-gray-800">
                <span>Giá vé</span>
                <span>{formatVND(Math.round(basePrice * 0.7))}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>{pkg}</span>
                <span>{formatVND(Math.round(basePrice * 0.65))}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Thuế VAT</span>
                <span>{formatVND(Math.round(basePrice * 0.05))}</span>
              </div>

              <div className="flex justify-between font-bold text-gray-800 mt-4">
                <span>Thuế, phí</span>
                <span>{formatVND(basePrice - Math.round(basePrice * 0.7))}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Phí an ninh soi chiếu</span>
                <span>{formatVND(20000)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Domestic airport tax</span>
                <span>{formatVND(100000)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Phí quản trị hệ thống</span>
                <span>{formatVND(basePrice - Math.round(basePrice * 0.7) - 120000 - 30000)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Thuế VAT</span>
                <span>{formatVND(30000)}</span>
              </div>

              <div className="flex justify-between font-bold text-gray-800 mt-4">
                <span>Dịch vụ</span>
                <span>{formatVND(totalAncillaryAll)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Tổng dịch vụ đã chọn</span>
                <span>{formatVND(Math.round(totalAncillaryAll / 1.08))}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs pl-2">
                <span>Thuế VAT</span>
                <span>{formatVND(totalAncillaryAll - Math.round(totalAncillaryAll / 1.08))}</span>
              </div>

              <div className="flex justify-between font-bold text-gray-800 mt-4">
                <span>Khác</span>
                <span>0 VND</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-[#da2128] text-lg border-t border-gray-200 pt-4 mt-4">
              <span>Tổng tiền</span>
              <span>{formatVND(totalPrice)}</span>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default function AncillaryPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#006079] font-bold">Đang tải dữ liệu...</div>}>
      <AncillaryContent />
    </Suspense>
  );
}
