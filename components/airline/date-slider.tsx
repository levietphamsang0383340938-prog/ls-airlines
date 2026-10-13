"use client"

import { format, addDays, parseISO, subDays } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getHolidayMultiplier, applyDynamicPrice } from "@/utils/pricing";
import { useLocale } from "@/components/locale-provider";

interface DateSliderProps {
  currentDateStr: string;
  onDateChange: (newDateStr: string) => void;
  currentMultiplier: number;
}

// Hàm tạo danh sách ngày tự động xung quanh ngày được chọn
const generateDatePrices = (baseDateStr: string, dateLocale: any) => {
  const baseDate = parseISO(baseDateStr);
  const dates = [];
  // Lấy 5 ngày trước và 5 ngày sau
  for (let i = -5; i <= 5; i++) {
    const d = addDays(baseDate, i);
    let dayName = format(d, "E", { locale: dateLocale });
    if (dateLocale === vi && dayName.startsWith("T")) {
      dayName = dayName.replace("T", "Th ");
    }
    
    const dStr = format(d, "yyyy-MM-dd");
    const multiplier = getHolidayMultiplier(dStr);
    const basePrice = i === 0 || i === 1 ? "988.181" : "1.160.181";
    const finalPrice = applyDynamicPrice(basePrice, multiplier);
    
    dates.push({
      dateObj: d,
      dateStr: dStr,
      dayName: dayName,
      dateNum: format(d, "dd"),
      price: finalPrice + " VND",
      selected: i === 0,
      isHoliday: multiplier > 1.1,
    });
  }
  return dates;
};

export function DateSlider({ currentDateStr, onDateChange, currentMultiplier }: DateSliderProps) {
  const { locale, currentLanguage } = useLocale();
  const dateFnsLocale = currentLanguage === 'vi' ? vi : enUS;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevDay = () => {
    const newDate = subDays(parseISO(currentDateStr), 1);
    onDateChange(format(newDate, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const newDate = addDays(parseISO(currentDateStr), 1);
    onDateChange(format(newDate, "yyyy-MM-dd"));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-[#eef5f8] p-3 shadow-sm">
      <div className="flex flex-col items-center justify-center mb-2">
        <h2 className="text-xs md:text-sm font-bold text-[#006079] capitalize flex items-center gap-2">
          {format(parseISO(currentDateStr), currentLanguage === 'vi' ? "EEEE, dd 'tháng' MM, yyyy" : "EEEE, MMMM dd, yyyy", { locale: dateFnsLocale })}
          {currentMultiplier > 1.1 && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm flex items-center gap-1">
              🔥 {locale.flightResults.holidayPrice}
            </span>
          )}
        </h2>
        <button className="mt-0.5 text-[10px] font-semibold text-[#006079] flex items-center gap-0.5 hover:underline">
          {locale.flightResults.hideDates} <ChevronDown className="size-2.5 rotate-180" />
        </button>
      </div>

      <div className="relative flex items-center">
        <button 
          onClick={handlePrevDay}
          className="absolute -left-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-[#006079] text-white shadow hover:bg-[#004d61]"
        >
          <ChevronLeft className="size-3" />
        </button>

        <div className="flex w-full items-end justify-between gap-0.5 overflow-x-auto px-3 py-0.5 no-scrollbar">
          {generateDatePrices(currentDateStr, dateFnsLocale).map((item, idx) => {
            const itemDate = new Date(item.dateObj);
            itemDate.setHours(0, 0, 0, 0);
            const isPast = itemDate < today;
            
            return (
              <div 
                key={idx} 
                onClick={() => !isPast && onDateChange(item.dateStr)}
                className={`flex flex-1 min-w-[50px] flex-col items-center group ${isPast ? 'opacity-50 cursor-not-allowed text-gray-400 pointer-events-none' : 'cursor-pointer'}`}
              >
                <div className={`w-full rounded-t-md p-1 text-center transition-all ${
                  item.selected 
                    ? "bg-[#eaaa00] text-gray-900 border-2 border-[#d89c00] font-bold shadow" 
                    : "bg-white border border-gray-300 text-gray-700 hover:border-[#006079]"
                }`}>
                  {isPast ? null : <span className="text-[10px] font-bold block">{item.price}</span>}
                  {item.isHoliday && <span className="text-[8px] text-red-600 font-bold hidden md:block">{locale.flightResults.holiday}</span>}
                </div>
                <div className={`w-full text-center py-0.5 text-[10px] font-semibold ${
                  item.selected ? "bg-[#eaaa00] text-gray-900 font-bold" : "bg-gray-100 text-gray-600"
                }`}>
                  {item.dayName} {item.dateNum}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleNextDay}
          className="absolute -right-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-[#006079] text-white shadow hover:bg-[#004d61]"
        >
          <ChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
