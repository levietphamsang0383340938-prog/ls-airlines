export const dictionary = {
  vi: {
    "nav.search_flight": "TÌM CHUYẾN BAY",
    "nav.my_booking": "QUẢN LÝ ĐẶT CHỖ",
    "nav.check_in": "LÀM THỦ TỤC",
    "nav.explore": "KHÁM PHÁ",
    "nav.promotions": "Ưu đãi",
    "nav.booking_info": "Thông tin hành trình",
    "nav.ls_experience": "Trải nghiệm LS Airlines",
    "nav.lotusmiles": "Lotusmiles",
    "nav.search_placeholder": "Tìm kiếm...",
    "nav.login": "Đăng nhập",
    "nav.signup": "Đăng ký",
    "nav.logout": "Đăng xuất",
    "nav.language": "Tiếng Việt",
    "nav.greeting": "Xin chào"
  },
  en: {
    "nav.search_flight": "SEARCH FLIGHTS",
    "nav.my_booking": "MANAGE BOOKING",
    "nav.check_in": "CHECK-IN",
    "nav.explore": "EXPLORE",
    "nav.promotions": "Offers",
    "nav.booking_info": "Travel Information",
    "nav.ls_experience": "LS Airlines Experience",
    "nav.lotusmiles": "Lotusmiles",
    "nav.search_placeholder": "Search...",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Log out",
    "nav.language": "English",
    "nav.greeting": "Hello"
  }
};

export type Locale = keyof typeof dictionary;
export type DictionaryKey = keyof typeof dictionary.vi;
