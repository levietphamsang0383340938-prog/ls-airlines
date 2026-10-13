"use client"

import { useState } from "react";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Plane,
  Briefcase,
  ClipboardCheck,
  BarChart,
  CalendarSearch,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  Gift,
  X,
  Calendar as CalendarIcon,
  Users,
  Plus,
  Minus,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DestinationSelector } from "./DestinationSelector";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useLocale } from "@/components/locale-provider";

type TripType = "round-trip" | "one-way" | "multi-city";
type PaymentMethod = "money" | "money-and-miles";

type Destination = {
  city: string;
  airport: string;
  code: string;
  region: string;
  country: string;
};

// Mock data và helper giá vé cho bộ lịch
const generateMockPrices = () => {
  const prices: Record<string, { price: number; isCheapest: boolean }> = {};
  const startDate = new Date("2026-08-01");
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateString = format(date, "yyyy-MM-dd");
    const randomPrice = 900000 + Math.random() * 2000000;
    prices[dateString] = {
      price: randomPrice,
      isCheapest: Math.random() > 0.85,
    };
  }
  return prices;
};
const mockPrices = generateMockPrices();

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1).replace('.0', '')}Tr`;
  }
  return `${Math.round(price / 1000)}Ng`;
};

export function FlightSearchWidget({ onSearch }: { onSearch?: (query?: string) => void }) {
  const { locale } = useLocale();
  // States cho Tra cứu lịch bay
  const [scheduleDate, setScheduleDate] = useState<DateRange | undefined>(undefined);

  const [activeTab, setActiveTab] = useState("mua-ve");
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("money");
  const [statusSearchType, setStatusSearchType] = useState<"flight-number" | "route">("route");
  const [flightNumber, setFlightNumber] = useState("");

  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaxPickerOpen, setIsPaxPickerOpen] = useState(false);

  // Ngày đi & Ngày về
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 7));

  const [origin, setOrigin] = useState<Destination>({ city: "Hà Nội", airport: "Nội Bài", code: "HAN", region: "Miền Bắc & Bắc Trung Bộ", country: "Việt Nam" });
  const [destination, setDestination] = useState<Destination | null>({ city: "Hải Phòng", airport: "Cát Bi", code: "HPH", region: "Miền Bắc", country: "Việt Nam" });

  // Số lượng hành khách
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const totalPax = adults + children + infants;

  const swapLocations = () => {
    if (origin && destination) {
      const temp = origin;
      setOrigin(destination);
      setDestination(temp);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (tripType === "one-way") {
      setDepartureDate(date);
      setIsDatePickerOpen(false);
    } else {
      if (date < departureDate) {
        setDepartureDate(date);
        setReturnDate(addDays(date, 7));
      } else {
        setReturnDate(date);
        setIsDatePickerOpen(false);
      }
    }
  };

  const handleSearchFlights = () => {
    if (!origin || !destination) {
      alert("Vui lòng chọn điểm đi và điểm đến.");
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.append('from', origin.code);
    queryParams.append('to', destination.code);
    queryParams.append('date', format(departureDate, 'yyyy-MM-dd'));
    if (tripType === "round-trip") {
      queryParams.append('returnDate', format(returnDate, 'yyyy-MM-dd'));
    }
    queryParams.append('pax', totalPax.toString());
    queryParams.append('tripType', tripType);

    if (onSearch) {
      onSearch(queryParams.toString());
    }
  };

  const handleSearchFlightStatus = () => {
    const queryParams = new URLSearchParams();
    if (statusSearchType === "route") {
      if (!origin || !destination) {
        alert("Vui lòng chọn điểm đi và điểm đến.");
        return;
      }
      queryParams.append('from', origin.code);
      queryParams.append('to', destination.code);
    } else {
      if (!flightNumber) {
        alert("Vui lòng nhập số hiệu chuyến bay.");
        return;
      }
      queryParams.append('flightNumber', flightNumber);
    }
    queryParams.append('date', format(departureDate, 'yyyy-MM-dd'));
    
    window.location.href = `/flight-status?${queryParams.toString()}`;
  };

  const mainTabs = [
    { id: "mua-ve", label: locale.bookingWidget.mainTabs[0], icon: Plane },
    { id: "quan-ly", label: locale.bookingWidget.mainTabs[1], icon: Briefcase },
    { id: "lam-thu-tuc", label: locale.bookingWidget.mainTabs[2], icon: ClipboardCheck },
    { id: "trang-thai", label: locale.bookingWidget.mainTabs[3], icon: BarChart },
    { id: "tra-cuu", label: locale.bookingWidget.mainTabs[4], icon: CalendarSearch },
  ];

  const tripTypeOptions: { id: TripType; label: string }[] = [
    { id: "round-trip", label: locale.bookingWidget.tripTabs[0] },
    { id: "one-way", label: locale.bookingWidget.tripTabs[1] },
    { id: "multi-city", label: locale.bookingWidget.tripTabs[2] },
  ];

  const CustomDayButton = (props: any) => {
    const { day, modifiers, ...buttonProps } = props;
    if (!day || !day.date) return <button {...buttonProps} />;

    const dateString = format(day.date, "yyyy-MM-dd");
    const dayPriceInfo = mockPrices[dateString];

    return (
      <button
        {...buttonProps}
        className={cn(
          buttonProps.className,
          "flex h-14 w-12 flex-col items-center justify-between py-1 my-0.5 rounded-lg transition-colors hover:bg-gray-100",
          buttonProps.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
        )}
      >
        <span className="text-sm font-semibold leading-none pt-1">
          {day.date.getDate()}
        </span>
        {dayPriceInfo ? (
          <span
            className={cn(
              "text-[10px] font-bold leading-none pb-1",
              dayPriceInfo.isCheapest ? "text-green-600 font-extrabold" : "text-gray-400"
            )}
          >
            {formatPrice(dayPriceInfo.price)}
          </span>
        ) : (
          <span className="h-2" />
        )}
      </button>
    );
  };

  return (
    <>
      <div className="mx-auto max-w-5xl w-full rounded-2xl md:rounded-3xl border border-gray-100 bg-white p-4 md:p-6 shadow-xl">
        {/* Main Tabs */}
        <div className="mb-5 flex items-center justify-between overflow-x-auto border-b border-gray-200 pb-3">
          <div className="flex items-center gap-6">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex cursor-pointer items-center whitespace-nowrap px-1 pb-3 transition-all",
                  activeTab === tab.id
                    ? "border-b-2 border-[#006079] font-bold text-[#006079] -mb-[14px]"
                    : "font-medium text-gray-500 hover:text-gray-800",
                )}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "mua-ve" && (
          <div>
            {/* Trip Type & Payment Switchers */}
            <div className="mb-6 flex flex-nowrap overflow-x-auto whitespace-nowrap items-center justify-between gap-6 pb-2 scrollbar-hide md:flex-wrap md:overflow-visible">
              <div className="flex items-center gap-2">
                {tripTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTripType(option.id)}
                    className={cn(
                      "cursor-pointer rounded-full px-5 py-2.5 min-h-[44px] text-sm font-medium transition-all flex items-center justify-center",
                      tripType === option.id
                        ? "bg-[#dcebf2] font-semibold text-[#006079]"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label htmlFor="payment-money" className="flex cursor-pointer items-center gap-2 min-h-[44px]">
                  <input
                    type="radio"
                    id="payment-money"
                    name="payment"
                    value="money"
                    checked={paymentMethod === "money"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="accent-[#006079]"
                  />
                  {locale.bookingWidget.paymentMoney}
                </label>
                <label htmlFor="payment-money-and-miles" className="flex cursor-pointer items-center gap-2 min-h-[44px]">
                  <input
                    type="radio"
                    id="payment-money-and-miles"
                    name="payment"
                    value="money-and-miles"
                    checked={paymentMethod === "money-and-miles"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="accent-[#006079]"
                  />
                  {locale.bookingWidget.paymentMoneyAndMiles}
                </label>
                <div className="flex items-center gap-3">
                  <a href="#" className="text-sm font-medium text-[#006079] underline hover:text-[#004d61]">
                    LotusSociety
                  </a>
                  <a href="#" className="text-sm font-medium text-[#006079] underline hover:text-[#004d61]">
                    Dặm bay
                  </a>
                </div>
              </div>
            </div>

            {/* Từ - Đến Section */}
            <div className="relative mb-6 grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              <button
                onClick={() => setIsOriginModalOpen(true)}
                className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50"
              >
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="size-4 text-gray-400" />
                  <span className="text-xs font-semibold uppercase text-gray-500">{locale.bookingWidget.from}</span>
                </div>
                <div className="mt-1">
                  <p className="text-2xl font-bold text-gray-800">{origin.code}</p>
                  <span className="mt-1 inline-block w-fit rounded-full border border-[#006079] px-3 py-1 text-xs text-[#006079]">
                    {origin.city}, {origin.country}
                  </span>
                </div>
              </button>

              <button
                onClick={swapLocations}
                className="cursor-pointer mx-auto w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 shadow-sm transition-transform hover:rotate-180 hover:bg-gray-200 md:mt-4 z-10 max-md:my-1 relative"
                aria-label="Đảo chiều điểm đi và điểm đến"
              >
                <ArrowLeftRight className="size-4 text-gray-600 max-md:rotate-90 transition-transform" />
              </button>

              <button
                onClick={() => setIsDestinationModalOpen(true)}
                className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50"
              >
                <div className="flex items-center gap-2">
                  <PlaneLanding className="size-4 text-gray-400" />
                  <span className="text-xs font-semibold uppercase text-gray-500">{locale.bookingWidget.to}</span>
                </div>
                <div className="mt-1">
                  {destination ? (
                    <>
                      <p className="text-2xl font-bold text-gray-800">{destination.code}</p>
                      <span className="mt-1 inline-block w-fit rounded-full border border-[#006079] px-3 py-1 text-xs text-[#006079]">
                        {destination.city}, {destination.country}
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-medium text-gray-400">{locale.bookingWidget.destinationPlaceholder}</p>
                      <div className="mt-1 h-[29px]"></div>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Khung Chọn Ngày (Căn chỉnh chuẩn vừa vặn cho Khứ hồi / Một chiều) */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Ô Căn chỉnh Ngày đi - Ngày về */}
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-gray-400" />
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      {tripType === "round-trip" ? locale.bookingWidget.dateAndReturn : locale.bookingWidget.dateOnly}
                    </span>
                  </div>

                  <div className="mt-1">
                    {tripType === "round-trip" ? (
                      /* Layout chia đôi cân đối 2 cột cho Vé khứ hồi */
                      <div className="grid grid-cols-2 items-center divide-x divide-gray-200">
                        <div className="pr-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase">{locale.bookingWidget.dateOnly}</p>
                          <p className="text-lg md:text-xl font-bold text-gray-800">
                            {format(departureDate, "dd/MM/yyyy")}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500 capitalize">
                            {format(departureDate, "EEEE", { locale: vi })}
                          </p>
                        </div>
                        <div className="pl-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase">{locale.bookingWidget.returnDate}</p>
                          <p className="text-lg md:text-xl font-bold text-gray-800">
                            {format(returnDate, "dd/MM/yyyy")}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500 capitalize">
                            {format(returnDate, "EEEE", { locale: vi })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Layout chuẩn 1 cột cho Vé một chiều */
                      <div>
                        <p className="text-2xl font-bold text-gray-800">
                          {format(departureDate, "dd/MM/yyyy")}
                        </p>
                        <span className="text-xs font-medium text-gray-500 capitalize">
                          {format(departureDate, "EEEE", { locale: vi })}
                        </span>
                      </div>
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-auto max-w-[95vw] overflow-x-auto p-3 shadow-2xl rounded-2xl bg-white" align="start">
                  <Calendar
                    locale={vi}
                    mode="single"
                    selected={tripType === "round-trip" ? returnDate : departureDate}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    pagedNavigation
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    components={{
                      DayButton: CustomDayButton as any,
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* Ô Hành khách */}
              <Popover open={isPaxPickerOpen} onOpenChange={setIsPaxPickerOpen}>
                <PopoverTrigger className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-gray-400" />
                    <span className="text-xs font-semibold uppercase text-gray-500">{locale.bookingWidget.passengers}</span>
                  </div>
                  <div className="mt-1">
                    <p className="text-2xl font-bold text-gray-800">
                      {String(totalPax).padStart(2, "0")} {locale.bookingWidget.passengers}
                    </p>
                    <span className="mt-1 text-sm font-medium text-gray-500">
                      {adults} {locale.bookingWidget.adults}{children > 0 ? `, ${children} ${locale.bookingWidget.children}` : ""}{infants > 0 ? `, ${infants} ${locale.bookingWidget.infants}` : ""}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-72 max-w-[95vw] p-4 shadow-xl rounded-2xl bg-white" align="start">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 border-b pb-2">{locale.bookingWidget.selectPax}</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{locale.bookingWidget.adults}</p>
                        <p className="text-xs text-gray-500">{locale.bookingWidget.adultsHint}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                          className="rounded-full border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">{adults}</span>
                        <button
                          onClick={() => setAdults(adults + 1)}
                          className="rounded-full border p-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{locale.bookingWidget.children}</p>
                        <p className="text-xs text-gray-500">{locale.bookingWidget.childrenHint}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                          className="rounded-full border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">{children}</span>
                        <button
                          onClick={() => setChildren(children + 1)}
                          className="rounded-full border p-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{locale.bookingWidget.infants}</p>
                        <p className="text-xs text-gray-500">{locale.bookingWidget.infantsHint}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          disabled={infants <= 0}
                          className="rounded-full border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">{infants}</span>
                        <button
                          onClick={() => setInfants(infants + 1)}
                          className="rounded-full border p-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPaxPickerOpen(false)}
                      className="w-full mt-2 rounded-xl bg-[#006079] py-2 text-sm font-semibold text-white hover:bg-[#004d61]"
                    >
                      {locale.bookingWidget.confirm}
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center">
              <button className="mb-4 flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-[#006079] hover:underline">
                <Gift className="size-4" />
                {locale.bookingWidget.promoNotReady}
              </button>
              <button
                onClick={handleSearchFlights}
                disabled={!origin || !destination}
                className="w-full rounded-full bg-[#006079] py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-[#004d61] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
              >
                {locale.bookingWidget.searchFlights}
              </button>
            </div>

            {/* Recent Searches */}
            <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <span className="font-medium text-gray-500">{locale.bookingWidget.recentSearch}</span>
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">
                <span>SGN ⇄ VII 20/01/2027 ➔ 01/02/2027</span>
                <button className="group">
                  <X className="size-3 text-gray-500 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trang-thai" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Search Type Toggle */}
            <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group text-sm font-medium text-gray-700" onClick={() => setStatusSearchType("flight-number")}>
                <div className={`w-4 h-4 rounded-full border ${statusSearchType === "flight-number" ? "border-[4px] border-[#006079]" : "border-gray-400 group-hover:border-[#006079]"} flex items-center justify-center`}></div>
                Số hiệu chuyến bay
              </label>
              <label className="flex items-center gap-2 cursor-pointer group text-sm font-medium text-gray-700" onClick={() => setStatusSearchType("route")}>
                <div className={`w-4 h-4 rounded-full border ${statusSearchType === "route" ? "border-[4px] border-[#006079]" : "border-gray-400 group-hover:border-[#006079]"} flex items-center justify-center`}></div>
                Đường bay
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr] items-center gap-4 mb-6 relative">
              {statusSearchType === "route" ? (
                <>
                  <button
                    onClick={() => setIsOriginModalOpen(true)}
                    className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50"
                  >
                    <div className="flex items-center gap-2">
                      <PlaneTakeoff className="size-4 text-[#006079]" />
                      <span className="text-xs font-semibold uppercase text-gray-500">Từ</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-2xl font-bold text-gray-800">{origin.code}</p>
                      <span className="mt-1 inline-block w-fit rounded-full border border-gray-200 px-3 py-1 text-[10px] text-gray-600">
                        {origin.city}, {origin.country}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={swapLocations}
                    className="cursor-pointer mx-auto w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-transform md:mt-4 z-10"
                  >
                    <ArrowLeftRight className="size-4 text-gray-600" />
                  </button>

                  <button
                    onClick={() => setIsDestinationModalOpen(true)}
                    className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50"
                  >
                    <div className="flex items-center gap-2">
                      <PlaneLanding className="size-4 text-[#006079]" />
                      <span className="text-xs font-semibold uppercase text-gray-500">Đến</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-2xl font-bold text-gray-800">{destination?.code || ""}</p>
                      <span className="mt-1 inline-block w-fit rounded-full border border-gray-200 px-3 py-1 text-[10px] text-gray-600">
                        {destination?.city || ""}, {destination?.country || ""}
                      </span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="md:col-span-3 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Plane className="size-4 text-[#006079]" />
                    <span className="text-xs font-semibold uppercase text-gray-500">Số hiệu chuyến bay</span>
                  </div>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="VD: VN 205"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Ngày bay */}
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50 pl-0 md:pl-4 md:border-l md:border-b-0">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-[#006079]" />
                    <span className="text-xs font-semibold uppercase text-gray-500">Ngày bay</span>
                  </div>
                  <div className="mt-1">
                    <p className="text-xl font-bold text-gray-800">
                      {format(departureDate, "E - dd/MM/yyyy", { locale: vi })}
                    </p>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 shadow-2xl rounded-2xl bg-white" align="start">
                  <Calendar
                    locale={vi}
                    mode="single"
                    selected={departureDate}
                    onSelect={handleDateSelect}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-xs text-gray-500 italic">
                *Thông tin trạng thái chuyến bay sẽ chỉ có sẵn trong vòng 48 giờ trước khi chuyến bay cất cánh hoặc hạ cánh.
              </p>
              <button
                onClick={handleSearchFlightStatus}
                className="w-full md:w-auto rounded-full bg-[#006079] px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#004d61] whitespace-nowrap"
              >
                Tìm chuyến bay
              </button>
            </div>
          </div>
        )}

        {activeTab === "tra-cuu" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Hàng 1: Từ / Đến */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6 relative">
              <button
                onClick={() => setIsOriginModalOpen(true)}
                className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50"
              >
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="size-4 text-[#006079]" />
                  <span className="text-xs font-semibold uppercase text-gray-500">Từ</span>
                </div>
                <div className="mt-1">
                  <p className="text-2xl font-bold text-gray-800">{origin.code}</p>
                  <span className="mt-1 inline-block w-fit rounded-full border border-gray-200 px-3 py-1 text-[10px] text-gray-600">
                    {origin.city}, {origin.country}
                  </span>
                </div>
              </button>

              <button
                onClick={swapLocations}
                className="cursor-pointer mx-auto w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-transform md:mt-4 z-10"
              >
                <ArrowLeftRight className="size-4 text-gray-600" />
              </button>

              <button
                onClick={() => setIsDestinationModalOpen(true)}
                className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50"
              >
                <div className="flex items-center gap-2">
                  <PlaneLanding className="size-4 text-[#006079]" />
                  <span className="text-xs font-semibold uppercase text-gray-500">Đến</span>
                </div>
                <div className="mt-1">
                  <p className="text-2xl font-bold text-gray-800">{destination?.code || ""}</p>
                  <span className="mt-1 inline-block w-fit rounded-full border border-gray-200 px-3 py-1 text-[10px] text-gray-600">
                    {destination?.city || ""}, {destination?.country || ""}
                  </span>
                </div>
              </button>
            </div>

            {/* Hàng 2: Ngày đi - Ngày về */}
            <div className="grid grid-cols-1 mb-6">
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger className="group w-full cursor-pointer border-b border-gray-200 pb-2 text-left transition-colors hover:border-[#006079]/50">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 text-[#006079]" />
                    <span className="text-xs font-semibold uppercase text-gray-500">Ngày đi - Ngày về</span>
                  </div>
                  <div className="mt-1 h-[32px] flex items-center">
                    {scheduleDate?.from ? (
                      <p className="text-xl font-bold text-[#006079]">
                        {format(scheduleDate.from, "dd/MM/yyyy", { locale: vi })} 
                        {scheduleDate.to ? ` - ${format(scheduleDate.to, "dd/MM/yyyy", { locale: vi })}` : " - DD/MM/YYYY"}
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-gray-400">
                        DD/MM/YYYY - DD/MM/YYYY
                      </p>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 shadow-2xl rounded-2xl bg-white" align="start">
                  <Calendar
                    locale={vi}
                    mode="range"
                    defaultMonth={scheduleDate?.from}
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                  <div className="flex justify-end mt-4">
                    <button onClick={() => setIsDatePickerOpen(false)} className="rounded-full bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300">
                      Chọn
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Hàng 3: Nút Tra cứu */}
            <div className="flex justify-end mt-6">
              <button
                className="w-full md:w-auto rounded-xl bg-[#006079] px-10 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#004d61]"
                onClick={() => {
                  alert("Tính năng Tra cứu lịch bay đang được phát triển!");
                }}
              >
                Tra cứu
              </button>
            </div>
          </div>
        )}
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
    </>
  );
}