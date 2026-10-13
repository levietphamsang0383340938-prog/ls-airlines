import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  // Bước 1: Thông tin liên lạc
  email: string;
  phoneAreaCode: string;
  phoneNumber: string;
  
  // Bước 2: Thông tin cá nhân
  title: string; // Danh xưng (Mr, Ms, Mrs, Dr, etc.)
  gender: string; // Giới tính (Male, Female, Other)
  firstName: string; // Tên
  middleName: string; // Đệm
  lastName: string; // Họ
  displayName: string; // Tên hiển thị trên thẻ
  dateOfBirth: Date; // Ngày sinh
  nationality: string; // Quốc tịch
  language: string; // Ngôn ngữ
  country: string; // Quốc gia/Vùng
  province: string; // Tỉnh/Thành phố/Bang
  promoCode: string; // Mã ưu đãi
  idNumber: string; // Số CCCD hoặc Passport
  idIssuePlace: string; // Nơi cấp CCCD
  idIssueDate: Date; // Ngày cấp CCCD
  company: string; // Cơ quan
  addressDetails: string; // Chỉ dẫn chi tiết
  address: string; // Địa chỉ
  ward: string; // Phường/Xã
  postalCode: string; // Mã bưu chính
  
  // Bảo mật
  password?: string; // `select: false` nên sẽ không có trong kết quả query mặc định
  
  // Tùy chọn
  receiveNewsletters: boolean; // Nhận tin
  agreeTerms: boolean; // Đồng ý điều khoản
  
  // Quên mật khẩu OTP
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;

  // Hệ thống
  role: 'user' | 'admin';
  membershipTier: string; // Hạng hội viên (Silver, Gold, Platinum)
  membershipNumber: string; // Số hội viên
  walletBalance: number; // Số dư ví điện tử
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  // Bước 1: Thông tin liên lạc
  email: { 
    type: String, 
    required: [true, 'Vui lòng cung cấp email.'], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Vui lòng cung cấp một địa chỉ email hợp lệ.']
  },
  phoneAreaCode: {
    type: String,
    required: [true, 'Vui lòng cung cấp mã vùng số điện thoại.'],
    trim: true,
    default: '+84'
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Vui lòng cung cấp số điện thoại.'], 
    unique: true,
    trim: true,
    match: [/^[0-9]{9,15}$/, 'Số điện thoại không hợp lệ.']
  },
  
  // Bước 2: Thông tin cá nhân
  title: {
    type: String,
    enum: ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof', 'Other'],
    required: [true, 'Vui lòng chọn danh xưng.']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Vui lòng chọn giới tính.']
  },
  firstName: {
    type: String,
    required: [true, 'Vui lòng cung cấp tên.'],
    trim: true
  },
  middleName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    required: [true, 'Vui lòng cung cấp họ.'],
    trim: true
  },
  displayName: {
    type: String,
    required: [true, 'Vui lòng cung cấp tên hiển thị trên thẻ.'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Vui lòng cung cấp ngày sinh.'],
    validate: {
      validator: function(value: Date) {
        // Kiểm tra người dùng phải ít nhất 12 tuổi
        const minAge = 12;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= minAge;
        }
        return age >= minAge;
      },
      message: 'Bạn phải đủ 12 tuổi để đăng ký.'
    }
  },
  nationality: {
    type: String,
    required: [true, 'Vui lòng cung cấp quốc tịch.'],
    trim: true,
    default: 'Vietnam'
  },
  language: {
    type: String,
    required: [true, 'Vui lòng chọn ngôn ngữ.'],
    enum: ['vi', 'en', 'ja', 'ko', 'zh'],
    default: 'vi'
  },
  country: {
    type: String,
    required: [true, 'Vui lòng cung cấp quốc gia/vùng.'],
    trim: true,
    default: 'Vietnam'
  },
  province: {
    type: String,
    required: [true, 'Vui lòng cung cấp tỉnh/thành phố.'],
    trim: true
  },
  promoCode: {
    type: String,
    trim: true,
    default: ''
  },
  idNumber: {
    type: String,
    trim: true,
    default: ''
  },
  idIssuePlace: {
    type: String,
    trim: true,
    default: ''
  },
  idIssueDate: {
    type: Date
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  addressDetails: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  ward: {
    type: String,
    trim: true,
    default: ''
  },
  postalCode: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Bảo mật
  password: {
    type: String,
    required: [true, 'Vui lòng cung cấp mật khẩu.'],
    select: false, // Quan trọng: không trả về mật khẩu trong các query mặc định
    minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự.']
  },
  
  // Tùy chọn
  receiveNewsletters: {
    type: Boolean,
    default: false
  },
  agreeTerms: {
    type: Boolean,
    required: [true, 'Bạn phải đồng ý với điều khoản và điều kiện.'],
    validate: {
      validator: function(value: boolean) {
        return value === true;
      },
      message: 'Bạn phải đồng ý với điều khoản và điều kiện để tiếp tục.'
    }
  },
  
  // Quên mật khẩu OTP
  resetPasswordOtp: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  
  // Hệ thống
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  membershipTier: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Silver'
  },
  membershipNumber: {
    type: String,
    unique: true,
    sparse: true // Cho phép null/undefined nhưng phải unique khi có giá trị
  },
  walletBalance: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true, // Tự động thêm 2 trường createdAt và updatedAt
  indexes: [
    { email: 1 }, // Index cho email để tìm kiếm nhanh hơn
    { phoneNumber: 1 }, // Index cho phoneNumber để tìm kiếm nhanh hơn
    { membershipNumber: 1 } // Index cho membershipNumber
  ]
});

// Middleware: Tự động tạo membershipNumber trước khi lưu
UserSchema.pre('save', async function() {
  if (!this.membershipNumber) {
    // Tạo số hội viên: BSV + năm + 6 số ngẫu nhiên
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    this.membershipNumber = `BSV${year}${random}`;
  }
});

// Virtual property để lấy fullName đầy đủ
UserSchema.virtual('fullName').get(function() {
  return `${this.lastName} ${this.middleName} ${this.firstName}`.trim();
});

// Virtual property để lấy phone đầy đủ
UserSchema.virtual('fullPhone').get(function() {
  return `${this.phoneAreaCode}${this.phoneNumber}`;
});

// Đảm bảo virtual fields được include khi chuyển thành JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Khắc phục lỗi Next.js cache schema cũ khi thêm trường mới
if (mongoose.models.User) {
  delete mongoose.models.User;
}
export default mongoose.model<IUser>('User', UserSchema);
