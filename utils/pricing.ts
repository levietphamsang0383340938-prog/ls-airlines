import { format, parseISO } from "date-fns";

// Danh sách các ngày lễ trong năm (định dạng MM-dd)
const HOLIDAYS = [
  "01-01", // Tết Dương lịch
  "04-30", // Giải phóng miền Nam
  "05-01", // Quốc tế Lao động
  "09-02", // Quốc khánh
  "12-24", // Noel
  "12-31"  // Giao thừa
];

export const getHolidayMultiplier = (dateStr: string): number => {
  try {
    const date = parseISO(dateStr);
    const mmDD = format(date, "MM-dd");
    
    // Nếu là ngày lễ, nhân hệ số 1.3
    if (HOLIDAYS.includes(mmDD)) {
      return 1.3;
    }
    
    // Nếu là cuối tuần (Thứ 7 = 6, CN = 0), nhân hệ số 1.1
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 1.1;
    }
    
    // Ngày thường giữ nguyên giá
    return 1.0;
  } catch (error) {
    return 1.0;
  }
};

// Hàm tiện ích để nhân giá tiền (chuỗi "2.497.181" => số => nhân => chuỗi)
export const applyDynamicPrice = (priceStr: string, multiplier: number): string => {
  if (multiplier === 1.0) return priceStr;
  
  // Loại bỏ dấu chấm để parse thành số
  const cleanPrice = priceStr.replace(/\./g, '');
  const priceNum = parseInt(cleanPrice, 10);
  
  if (isNaN(priceNum)) return priceStr;
  
  const newPriceNum = Math.round(priceNum * multiplier);
  
  // Format lại thành chuỗi có dấu chấm
  return newPriceNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
