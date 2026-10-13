"use client"

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { getHolidayMultiplier, applyDynamicPrice } from "@/utils/pricing";
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  SlidersHorizontal,
  Bell,
  Clock,
  ExternalLink,
  ChevronUp,
  CheckCircle2,
  Info,
  Users,
  Plus,
  Minus
} from "lucide-react";
import { DestinationSelector } from "@/components/airline/DestinationSelector";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PaymentQRModal } from "@/components/airline/payment-qr-modal";
import { DateSlider } from "@/components/airline/date-slider";
import { useLocale } from "@/components/locale-provider";
import { getCityName } from "@/lib/flights";

interface PageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    date?: string;
    pax?: string;
    tripType?: string;
    returnDate?: string;
  }>;
}
export default function AvailabilityPage({ searchParams }: PageProps) {
  const { locale, currentLanguage, setLanguage } = useLocale();
  const dateFnsLocale = currentLanguage === 'vi' ? vi : enUS;
  const router = useRouter();
  const params = use(searchParams);

  const from = params.from || "HAN";
  const to = params.to || "DAD";
  const date = params.date || format(new Date(), "yyyy-MM-dd");
  const pax = params.pax || "1";
  
  // Tính toán hệ số giá vé cho ngày hiện tại (Holiday Pricing)
  const currentMultiplier = getHolidayMultiplier(date);
  
  // State quản lý danh sách chuyến bay từ Database
  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dữ liệu từ API
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/flights?from=${from}&to=${to}&date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFlights(data.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu chuyến bay:", err);
        setIsLoading(false);
      });
  }, [from, to, date]);

  // Cập nhật giá động cho danh sách chuyến bay theo ngày chọn
  const dynamicFlights = flights.map(flight => {
    return {
      ...flight,
      economy: {
        ...flight.economy,
        price: applyDynamicPrice(flight.economy.price, currentMultiplier),
        packages: flight.economy.packages.map((p: any) => ({ ...p, price: applyDynamicPrice(p.price.replace(" VND", ""), currentMultiplier) + " VND" }))
      },
      deluxe: {
        ...flight.deluxe,
        price: applyDynamicPrice(flight.deluxe.price, currentMultiplier),
        packages: flight.deluxe.packages.map((p: any) => ({ ...p, price: applyDynamicPrice(p.price.replace(" VND", ""), currentMultiplier) + " VND" }))
      },
      business: {
        ...flight.business,
        price: applyDynamicPrice(flight.business.price, currentMultiplier),
        packages: flight.business.packages.map((p: any) => ({ ...p, price: applyDynamicPrice(p.price.replace(" VND", ""), currentMultiplier) + " VND" }))
      }
    };
  });

  // State quản lý việc xổ chi tiết hạng vé cho từng chuyến bay
  // Key dạng `${flightId}-${classType}` (VD: "VN7151-economy")
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{ flightId: string; packageName: string; price: string } | null>(null);
  const [isPaymentQRModalOpen, setIsPaymentQRModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);

  // Search Form States
  const initialTripType = params.tripType || "round-trip";
  const [tripType, setTripType] = useState(initialTripType);
  const [departureDate, setDepartureDate] = useState<Date>(date ? parseISO(date) : new Date());
  const [adults, setAdults] = useState(parseInt(pax || "1"));
  const [childrenState, setChildrenState] = useState(0);
  const [infants, setInfants] = useState(0);
  const totalPax = adults + childrenState + infants;

  const [origin, setOrigin] = useState({ city: getCityName(from), code: from, airport: "", country: "", region: "" });
  const [destination, setDestination] = useState({ city: getCityName(to), code: to, airport: "", country: "", region: "" });

  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaxPickerOpen, setIsPaxPickerOpen] = useState(false);

  const handleUpdateSearch = () => {
    const query = new URLSearchParams();
    query.append("from", origin.code);
    query.append("to", destination.code);
    query.append("date", format(departureDate, "yyyy-MM-dd"));
    if (params.returnDate) {
      query.append("returnDate", params.returnDate as string);
    }
    query.append("pax", totalPax.toString());
    query.append("tripType", tripType);
    
    setIsChangeFormOpen(false);
    router.push(`/booking/availability?${query.toString()}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateChange = (newDate: Date) => {
    const newDateStr = format(newDate, "yyyy-MM-dd");
    const query = new URLSearchParams(window.location.search);
    query.set("date", newDateStr);
    router.push(`?${query.toString()}`);
  };

  const toggleExpand = (flightId: string, classType: string) => {
    const key = `${flightId}-${classType}`;
    if (expandedKey === key) {
      setExpandedKey(null);
    } else {
      setExpandedKey(key);
    }
  };

  const handleConfirmPackage = (flight: any, pkgName: string, price: string) => {
    // Chuyển sang Bước 2: Trang điền thông tin hành khách
    const query = new URLSearchParams({
      flightId: flight.id,
      from,
      to,
      date,
      pax,
      package: pkgName,
      price
    });
    router.push(`/passenger?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans pb-12">
      <div className="w-full max-w-7xl mx-auto">
      {/* 1. FLIGHT INFO HEADER (Matching Image 2) */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full">
        {/* Top bar: Logo, Home, Language, Login */}
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 md:px-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <span className="text-xl text-[#006079] font-bold hidden sm:inline">LS Airlines</span>
            </Link>
            
            <div className="w-px h-5 bg-gray-300 mx-2 hidden md:block"></div>
            
            <Link href="/" className="text-gray-700 hover:text-[#006079] text-sm hidden md:block">
              {currentLanguage === 'vi' ? "Trang chủ" : "Home"}
            </Link>
            
            <div className="w-px h-5 bg-gray-300 mx-2 hidden md:block"></div>
            
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-[#006079] focus:outline-none"
              >
                <span>{currentLanguage === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                <ChevronDown className={`size-3.5 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full mt-3 left-0 w-32 bg-white border border-gray-200 shadow-lg rounded-md py-1 z-50">
                  <button 
                    onClick={() => { setLanguage('vi'); setIsLangMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentLanguage === 'vi' ? 'font-bold text-[#006079]' : 'text-gray-700'}`}
                  >
                    Tiếng Việt
                  </button>
                  <button 
                    onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentLanguage === 'en' ? 'font-bold text-[#006079]' : 'text-gray-700'}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flight Info bar */}
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between">
          
          <div className="flex items-center h-full pl-4 md:pl-6 gap-6 md:gap-8 flex-1 overflow-x-auto no-scrollbar">
            {/* Cột Tuyến đường */}
            <div className="flex flex-col justify-center min-w-[220px]">
              <div className="flex items-center justify-between font-bold text-lg md:text-xl text-gray-900">
                <span>{from}</span>
                <div className="flex-1 mx-2 relative flex items-center">
                  <div className="w-full border-t-[2px] border-dotted border-gray-400"></div>
                  <span className="text-gray-600 text-sm absolute right-0 bg-white pl-1">✈</span>
                </div>
                <span>{to}</span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 font-medium">
                <span>{getCityName(from)}</span>
                <span>{getCityName(to)}</span>
              </div>
            </div>

            <div className="h-3/5 w-px bg-gray-300 hidden sm:block"></div>

            {/* Cột Ngày đi */}
            <div className="hidden sm:flex flex-col justify-center whitespace-nowrap">
              <div className="text-gray-600 text-[11px] md:text-xs font-bold">{locale.flightResults.trip}</div>
              <div className="font-bold text-gray-900 text-sm md:text-base mt-0.5">
                {format(parseISO(date), currentLanguage === 'vi' ? "E, d 'thg' M" : "E, MMM d", { locale: dateFnsLocale })}
              </div>
            </div>

            <div className="h-3/5 w-px bg-gray-300 hidden md:block"></div>

            {/* Cột Hành khách */}
            <div className="hidden md:flex flex-col justify-center whitespace-nowrap">
              <div className="text-gray-600 text-[11px] md:text-xs font-bold">{locale.flightResults.passenger}</div>
              <div className="font-bold text-gray-900 text-sm md:text-base mt-0.5">{pax} 👤</div>
            </div>
          </div>

          {/* Nút THÔNG TIN ĐẶT CHỖ (Full height) */}
          <button className="h-full bg-[#eaaa00] hover:bg-[#d89c00] px-4 md:px-8 flex flex-col items-center justify-center font-bold text-gray-900 transition-colors flex-shrink-0">
            <ShoppingCart className="size-5 md:size-6 mb-0.5 md:mb-1" />
            <span className="text-[10px] md:text-sm uppercase tracking-wider">{locale.flightResults.bookingInfo}</span>
          </button>
          
        </div>
      </header>

      {/* 2. SEARCH MODIFY PANEL & HERO BANNER */}
      <div className="w-full relative bg-[#e9f0f3]">
        
        {/* Toggle Button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
           <button 
             onClick={() => setIsChangeFormOpen(!isChangeFormOpen)}
             className="bg-white border border-gray-200 rounded-b-xl px-6 py-1 text-[10px] md:text-xs font-semibold text-[#006079] shadow-sm hover:bg-gray-50 flex items-center gap-1 transition-all"
           >
             {locale.flightResults.change} 
             {isChangeFormOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
           </button>
        </div>

        {/* Form Expandable Area */}
        <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-200 ${isChangeFormOpen ? 'max-h-[500px] opacity-100 py-8' : 'max-h-0 opacity-0 py-0 border-transparent'}`}>
           <div className="max-w-4xl mx-auto px-4 mt-2">
             {/* Radio Buttons */}
             <div className="flex items-center gap-6 mb-5 text-xs font-medium text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setTripType("round-trip")}>
                   <div className={`w-4 h-4 rounded-full border ${tripType === "round-trip" ? "border-[4px] border-[#eaaa00]" : "border-[#006079] group-hover:border-[#004d61]"} flex items-center justify-center`}></div>
                   {locale.flightResults.roundTrip}
                </label>
                <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setTripType("one-way")}>
                   <div className={`w-4 h-4 rounded-full border ${tripType === "one-way" ? "border-[4px] border-[#eaaa00]" : "border-[#006079] group-hover:border-[#004d61]"} flex items-center justify-center`}></div>
                   {locale.flightResults.oneWay}
                </label>
                <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setTripType("multi-city")}>
                   <div className={`w-4 h-4 rounded-full border ${tripType === "multi-city" ? "border-[4px] border-[#eaaa00]" : "border-[#006079] group-hover:border-[#004d61]"} flex items-center justify-center`}></div>
                   {locale.flightResults.multiCity}
                </label>
             </div>

             {/* Inputs Row 1 */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                {/* Từ */}
                <div className="col-span-1 md:col-span-4 relative cursor-pointer" onClick={() => setIsOriginModalOpen(true)}>
                   <span className="absolute -top-2 left-3 bg-[#e9f0f3] px-1 text-[9px] text-gray-600 z-10">{locale.flightResults.fromLabel} *</span>
                   <div className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs flex justify-between items-center h-10 shadow-sm hover:border-[#006079]">
                      <span className="truncate">{origin.city} ({origin.code})</span>
                      <span className="text-gray-400 rotate-45 text-[10px]">✈</span>
                   </div>
                </div>

                {/* Đến */}
                <div className="col-span-1 md:col-span-4 relative cursor-pointer" onClick={() => setIsDestinationModalOpen(true)}>
                   <span className="absolute -top-2 left-3 bg-[#e9f0f3] px-1 text-[9px] text-gray-600 z-10">{locale.flightResults.toLabel} *</span>
                   <div className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs flex justify-between items-center h-10 shadow-sm hover:border-[#006079]">
                      <span className="truncate">{destination.city} ({destination.code})</span>
                      <span className="text-gray-400 rotate-45 text-[10px]">✈</span>
                   </div>
                </div>

                {/* Ngày */}
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger>
                    <div className="col-span-1 md:col-span-4 relative cursor-pointer">
                       <span className="absolute -top-2 left-3 bg-[#e9f0f3] px-1 text-[9px] text-gray-600 z-10">{locale.flightResults.dateLabel} *</span>
                       <div className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs flex justify-between items-center h-10 shadow-sm hover:border-[#006079]">
                          <span className="truncate">{format(departureDate, currentLanguage === 'vi' ? "E, d 'thg' M" : "E, MMM d", { locale: dateFnsLocale })}</span>
                          <span className="text-gray-400">📅</span>
                       </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 shadow-2xl rounded-2xl bg-white z-[60]" align="start">
                    <Calendar
                      locale={dateFnsLocale}
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => { if (date) { setDepartureDate(date); setIsDatePickerOpen(false); } }}
                      numberOfMonths={1}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
             </div>

             {/* Inputs Row 2 & Button */}
             <div className="flex flex-col md:flex-row justify-between items-end gap-4 mt-2 md:mt-0">
                {/* Hành khách */}
                <Popover open={isPaxPickerOpen} onOpenChange={setIsPaxPickerOpen}>
                  <PopoverTrigger>
                    <div className="w-full md:w-[32%] relative cursor-pointer">
                       <span className="absolute -top-2 left-3 bg-[#e9f0f3] px-1 text-[9px] text-gray-600 z-10">{locale.flightResults.paxLabel} *</span>
                       <div className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs flex justify-between items-center h-10 shadow-sm hover:border-[#006079]">
                          <span className="truncate">{totalPax} {locale.flightResults.paxLabel.toLowerCase()}</span>
                          <span className="text-gray-400">👥</span>
                       </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4 shadow-xl rounded-2xl bg-white z-[60]" align="start">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 border-b pb-2">{locale.bookingWidget?.selectPax || "Chọn số hành khách"}</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{locale.bookingWidget?.adults || "Người lớn"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1} className="rounded-full border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30">
                            <Minus className="size-4" />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold">{adults}</span>
                          <button onClick={() => setAdults(adults + 1)} className="rounded-full border p-1 text-gray-600 hover:bg-gray-100">
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{locale.bookingWidget?.children || "Trẻ em"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setChildrenState(Math.max(0, childrenState - 1))} disabled={childrenState <= 0} className="rounded-full border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30">
                            <Minus className="size-4" />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold">{childrenState}</span>
                          <button onClick={() => setChildrenState(childrenState + 1)} className="rounded-full border p-1 text-gray-600 hover:bg-gray-100">
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{locale.bookingWidget?.infants || "Em bé"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setInfants(Math.max(0, infants - 1))} disabled={infants <= 0} className="rounded-full border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30">
                            <Minus className="size-4" />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold">{infants}</span>
                          <button onClick={() => setInfants(infants + 1)} className="rounded-full border p-1 text-gray-600 hover:bg-gray-100">
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>

                      <button onClick={() => setIsPaxPickerOpen(false)} className="w-full mt-2 rounded-xl bg-[#006079] py-2 text-sm font-semibold text-white hover:bg-[#004d61]">
                        {locale.bookingWidget?.confirm || "Xác nhận"}
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="w-full md:w-auto mt-2 md:mt-0 flex justify-end">
                   <button 
                     onClick={handleUpdateSearch}
                     className="px-6 py-2 border-[1.5px] border-[#006079] text-[#006079] font-bold text-[10px] md:text-xs rounded hover:bg-[#006079] hover:text-white transition-colors uppercase tracking-wider"
                   >
                     {locale.flightResults.saveChanges}
                   </button>
                </div>
             </div>
           </div>
        </div>

        {/* HERO BANNER */}
        <section 
          className="relative h-28 md:h-36 w-full overflow-hidden flex items-center justify-center transition-all bg-[#009ed8]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop")', backgroundPosition: 'center', backgroundSize: 'cover' }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-[#006079]/10"></div>
          
          <button className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-r bg-[#eaaa00] px-3 py-1.5 text-[10px] md:text-xs font-bold text-gray-900 shadow-md">
            <Bell className="size-3.5" /> {locale.flightResults.goodPrice}
          </button>

          <div className="z-10 rounded bg-white px-6 py-3 shadow-lg text-center min-w-[200px]">
            <h1 className="text-sm md:text-base font-bold text-[#006079]">
              {locale.flightResults.selectFlight}
            </h1>
            <p className="text-[10px] md:text-xs font-semibold text-[#006079] mt-0.5">
              {getCityName(from)} {locale.flightResults.to.toLowerCase()} {getCityName(to)}
            </p>
          </div>
        </section>
      </div>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-3 py-4 space-y-4">
        {/* LƯU Ý HÀNH LÝ */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm text-[10px] leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-800">
            {locale.flightResults.baggageInfo1}<a href="#" className="text-[#006079] underline">{locale.flightResults.baggageInfo2}</a>
          </p>
          <p className="mt-0.5 font-bold text-gray-800">
            {locale.flightResults.note} <span className="font-normal text-gray-600">{locale.flightResults.noteContent}</span>
          </p>
          <div className="mt-0.5 flex flex-wrap gap-2 font-semibold text-[#006079]">
            <a href="#" className="hover:underline">{locale.flightResults.fee1}</a>
            <a href="#" className="hover:underline">{locale.flightResults.fee2}</a>
          </div>
        </div>

        {/* BẢNG NGÀY */}
        <DateSlider 
          currentDateStr={date} 
          onDateChange={handleDateChange} 
          currentMultiplier={currentMultiplier} 
        />

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button className="flex items-center gap-1.5 rounded-lg bg-[#eaaa00] px-3 py-1.5 font-bold text-gray-900 shadow hover:bg-[#d89c00] text-[10px] uppercase tracking-wider">
            <SlidersHorizontal className="size-3" />
            {locale.flightResults.showFilters}
          </button>

          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-700">
            <span>{locale.flightResults.sortBy}</span>
            <button className="flex items-center gap-0.5 font-bold text-[#006079] hover:underline">
              {locale.flightResults.default} <ChevronDown className="size-2.5" />
            </button>
          </div>
        </div>

        {/* DANH SÁCH CHUYẾN BAY */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500 font-semibold flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-4 border-[#006079] border-t-transparent rounded-full animate-spin"></div>
              <span>Đang tìm kiếm chuyến bay...</span>
            </div>
          ) : dynamicFlights.length === 0 ? (
            <div className="py-10 text-center text-gray-500 font-semibold bg-white rounded-xl shadow-sm border border-gray-200">
              Không tìm thấy chuyến bay nào hợp lệ cho ngày này.
            </div>
          ) : dynamicFlights.map((flight) => {
            const isEconomyOpen = expandedKey === `${flight.id}-economy`;
            const isDeluxeOpen = expandedKey === `${flight.id}-deluxe`;
            const isBusinessOpen = expandedKey === `${flight.id}-business`;
            const isAnyOpen = isEconomyOpen || isDeluxeOpen || isBusinessOpen;

            let activePackages = flight.economy.packages;
            let activeClassName = "Phổ Thông Linh Hoạt";
            if (isDeluxeOpen) {
              activePackages = flight.deluxe.packages;
              activeClassName = "Phổ Thông Đặc Biệt";
            } else if (isBusinessOpen) {
              activePackages = flight.business.packages;
              activeClassName = "Thương Gia";
            }

            return (
              <div key={flight.id} className="relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                
                {/* Badge số ghế còn lại */}
                <div className="absolute top-0 right-0 rounded-bl-lg bg-[#006079] px-2 py-0.5 text-[9px] font-bold text-white z-10">
                  {flight.seatsLeft} {locale.flightResults.seatsLeft}
                </div>

                {/* HÀNG CHÍNH CARD CHUYẾN BAY */}
                <div className="flex flex-col lg:flex-row">
                  {/* Thông tin chuyến bay */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-lg font-bold text-gray-800">{flight.departTime}</span>
                        <p className="text-[10px] font-bold text-gray-700">{flight.departAirport}</p>
                        <p className="text-[9px] text-gray-400">{flight.departTerminal}</p>
                      </div>

                      <div className="flex-1 text-center">
                        <span className="text-[10px] text-gray-500 font-medium">
                          {flight.flightType === "Bay thẳng" ? locale.flightResults.directFlight : flight.flightType}
                        </span>
                        <div className="relative my-0.5 border-t-2 border-dashed border-gray-300 w-full"></div>
                        <span className="text-[9px] text-gray-400">{flight.duration}</span>
                      </div>

                      <div>
                        <span className="text-lg font-bold text-gray-800">{flight.arrivalTime}</span>
                        <p className="text-[10px] font-bold text-gray-700">{flight.arrivalAirport}</p>
                        <p className="text-[9px] text-gray-400">{flight.arrivalTerminal}</p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>🌸</span>
                        <span className="text-[9px]">
                          {flight.operator.replace("Khai thác bởi", locale.flightResults.operatedBy)}
                        </span>
                      </div>
                      <button className="flex items-center gap-0.5 font-semibold text-[#006079] hover:underline text-[10px]">
                        {locale.flightResults.flightDetails} <ExternalLink className="size-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3 HẠNG VÉ */}
                  <div className="grid grid-cols-3 w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-200">
                    
                    {/* Hạng Phổ thông */}
                    <button
                      onClick={() => toggleExpand(flight.id, "economy")}
                      className={`p-2 text-white flex flex-col items-center justify-between transition-colors cursor-pointer text-center ${
                        isEconomyOpen ? "bg-[#004d61]" : "bg-[#006079] hover:bg-[#004d61]"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{locale.flightResults.economy}</span>
                      <div className="my-1">
                        <span className="text-[9px] opacity-80 block">{locale.flightResults.from}</span>
                        <span className="text-sm font-extrabold">{flight.economy.price}</span>
                        <span className="text-[9px] block opacity-80">VND</span>
                      </div>
                      {isEconomyOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </button>

                    {/* Hạng Phổ thông đặc biệt */}
                    <button
                      onClick={() => toggleExpand(flight.id, "deluxe")}
                      className={`p-2 text-[#006079] flex flex-col items-center justify-between transition-colors cursor-pointer text-center ${
                        isDeluxeOpen ? "bg-[#b0d8e2]" : "bg-[#d2e8ee] hover:bg-[#c2e0e7]"
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider">{locale.flightResults.premiumEconomy}</span>
                      <div className="my-1">
                        <span className="text-[9px] opacity-80 block">{locale.flightResults.from}</span>
                        <span className="text-sm font-extrabold">{flight.deluxe.price}</span>
                        <span className="text-[9px] block opacity-80">VND</span>
                      </div>
                      {isDeluxeOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </button>

                    {/* Hạng Thương gia */}
                    <button
                      onClick={() => toggleExpand(flight.id, "business")}
                      className={`p-2 text-gray-900 flex flex-col items-center justify-between transition-colors cursor-pointer text-center ${
                        isBusinessOpen ? "bg-[#c89100]" : "bg-[#eaaa00] hover:bg-[#d89c00]"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{locale.flightResults.business}</span>
                      <div className="my-1">
                        <span className="text-[9px] opacity-80 block">{locale.flightResults.from}</span>
                        <span className="text-sm font-extrabold">{flight.business.price}</span>
                        <span className="text-[9px] block opacity-80">VND</span>
                      </div>
                      {isBusinessOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </button>

                  </div>
                </div>

                {/* BẢNG XỔ CHI TIẾT BÊN DƯỚI KHI BẤM CHỌN HẠNG VÉ (Chuẩn Ảnh 2, 3, 4) */}
                {isAnyOpen && (
                  <div className="border-t border-gray-200 bg-[#f8fafc] p-4 text-center animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-xs font-bold text-[#006079]">{locale.flightResults.selectFare}</h3>
                    <a href="#" className="text-[10px] text-[#006079] underline hover:text-[#004d61]">
                      {locale.flightResults.fareConditions}
                    </a>

                    {/* Danh sách gói vé xổ ra */}
                    <div className="mt-4 flex flex-wrap items-stretch justify-center gap-4">
                      {activePackages.map((pkg, idx) => {
                        const isSelected = selectedPackage?.flightId === flight.id && selectedPackage?.packageName === pkg.name;

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedPackage({ flightId: flight.id, packageName: pkg.name, price: pkg.price })}
                            className={`w-56 rounded-xl bg-white p-3 shadow-sm border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                              isSelected ? "border-[#006079] ring-2 ring-[#006079]/20" : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div>
                              {(pkg as any).isWarning && (
                                <p className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5 mb-0.5">
                                  {locale.flightResults.warning}
                                </p>
                              )}
                              <div className="text-center pb-2 border-b border-gray-100">
                                <span className="inline-block size-2 rounded-full border-2 border-gray-400 mb-0.5"></span>
                                <p className="text-sm font-extrabold text-gray-800">{pkg.price}</p>
                                <p className="text-[10px] font-semibold text-gray-600">{pkg.name}</p>
                                
                                {pkg.badge && (
                                  <span className="mt-1 inline-block rounded-full bg-[#006079] px-2 py-0.5 text-[9px] font-bold text-white">
                                    🔔 {pkg.badge}
                                  </span>
                                )}
                              </div>

                              {/* Điều kiện chi tiết */}
                              <div className="mt-3 space-y-2 text-[10px] text-gray-700">
                                <div className="flex items-start gap-1.5">
                                  <span>💸</span>
                                  <div>
                                    <p className="font-bold">{locale.flightResults.changeTicket}</p>
                                    <p className="text-[9px] text-gray-500">{pkg.changeFee}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-1.5">
                                  <span>💳</span>
                                  <div>
                                    <p className="font-bold">{locale.flightResults.refundTicket}</p>
                                    <p className="text-[9px] text-gray-500">{pkg.refundFee}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-1.5">
                                  <span>🧳</span>
                                  <div>
                                    <p className="font-bold">{locale.flightResults.checkedBaggage}</p>
                                    <p className="text-[9px] text-gray-500">{pkg.checkedBaggage}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-1.5">
                                  <span>🎒</span>
                                  <div>
                                    <p className="font-bold">{locale.flightResults.carryBaggage}</p>
                                    <p className="text-[9px] text-gray-500">{pkg.carryBaggage}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-1.5">
                                  <span>🌟</span>
                                  <div>
                                    <p className="font-bold">{locale.flightResults.milesEarned}</p>
                                    <p className="text-[9px] text-amber-600 font-semibold">{pkg.miles}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <a href="#" className="mt-3 text-right text-[10px] font-semibold text-green-700 underline block">
                              {locale.flightResults.details}
                            </a>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dòng xác nhận & Nút XÁC NHẬN VÀ TIẾP TỤC (Ảnh 2, 3, 4) */}
                    {selectedPackage?.flightId === flight.id && (
                      <div className="mt-4 flex flex-col items-center gap-2 animate-in fade-in">
                        <p className="text-[10px] font-semibold text-gray-700 flex items-center gap-0.5">
                          <CheckCircle2 className="size-3 text-amber-500" />
                          {locale.flightResults.selected} <strong className="text-[#006079]">{selectedPackage.packageName}</strong>.
                        </p>

                        <button
                          onClick={() => {
                            setIsPaymentQRModalOpen(true);
                            handleConfirmPackage(flight, selectedPackage.packageName, selectedPackage.price);
                          }}
                          className="rounded-lg border-2 border-[#006079] bg-white px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-[#006079] shadow-sm hover:bg-[#006079] hover:text-white transition-all"
                        >
                          {locale.flightResults.confirmAndContinue}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedKey(null)}
                      className="mt-3 text-[10px] font-semibold text-gray-400 hover:text-gray-600"
                    >
                      {locale.flightResults.collapse}
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* NÚT QUAY LẠI */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#eaaa00] px-4 py-2 font-bold text-gray-900 shadow hover:bg-[#d89c00] transition-colors uppercase text-[10px] tracking-wider"
          >
            {locale.flightResults.back}
          </Link>
        </div>
      </main>

      <PaymentQRModal
        isOpen={isPaymentQRModalOpen}
        onClose={() => setIsPaymentQRModalOpen(false)}
        amount="3.037.181 VND"
        onTimeout={() => {
          setIsPaymentQRModalOpen(false);
          alert(locale.flightResults.timeout);
        }}
      />
      </div>
      <DestinationSelector
        isOpen={isOriginModalOpen}
        onClose={() => setIsOriginModalOpen(false)}
        onSelect={(dest) => setOrigin(dest)}
        selectedValue={origin?.code}
      />

      <DestinationSelector
        isOpen={isDestinationModalOpen}
        onClose={() => setIsDestinationModalOpen(false)}
        onSelect={(dest) => setDestination(dest)}
        selectedValue={destination?.code}
      />
    </div>
  );
}