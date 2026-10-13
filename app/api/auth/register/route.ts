import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  // Outer try-catch để đảm bảo không có lỗi nào làm sập server
  try {
    // 1. KẾT NỐI DATABASE
    console.log("===> KẾT NỐI DATABASE...");
    try {
      await connectDB();
      console.log("===> ĐÃ KẾT NỐI DATABASE THÀNH CÔNG");
      
      // Xoá index cũ 'phone_1' (nếu có) để tránh lỗi E11000 dup key: { phone: null }
      // do schema mới dùng 'phoneNumber' thay vì 'phone'
      try {
        const mongoose = require('mongoose');
        await mongoose.connection.collection('users').dropIndex('phone_1');
      } catch (e) {
        // Bỏ qua lỗi nếu index không tồn tại
      }
    } catch (dbConnectionError: any) {
      console.error('❌ Lỗi kết nối database:', dbConnectionError);
      console.error('Error details:', JSON.stringify(dbConnectionError, null, 2));
      return NextResponse.json(
        { message: 'Không thể kết nối đến database. Vui lòng thử lại sau.' },
        { status: 503 }
      );
    }

    // 2. PARSE REQUEST BODY
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Lỗi parse JSON body:', parseError);
      return NextResponse.json(
        { message: 'Dữ liệu gửi lên không hợp lệ.' },
        { status: 400 }
      );
    }

    console.log("🚀 [REGISTER] Email:", body.email, "Phone:", body.phoneNumber);

    // 3. TRÍCH XUẤT VÀ CHUẨN HÓA DỮ LIỆU - BƯỚC 1
    const email = body.email?.toLowerCase().trim();
    const phoneAreaCode = body.phoneAreaCode?.trim() || '+84';
    const phoneNumber = body.phoneNumber?.trim();

    // 4. VALIDATION BƯỚC 1 - THÔNG TIN LIÊN LẠC
    if (!email || !phoneNumber) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin liên lạc (Email, Số điện thoại).' },
        { status: 400 }
      );
    }

    // VALIDATION EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email không đúng định dạng.' },
        { status: 400 }
      );
    }

    // VALIDATION PHONE NUMBER
    if (!/^[0-9]{9,15}$/.test(phoneNumber)) {
      return NextResponse.json(
        { message: 'Số điện thoại không hợp lệ (phải từ 9-15 chữ số).' },
        { status: 400 }
      );
    }

    // 5. VALIDATION BƯỚC 2 - THÔNG TIN CÁ NHÂN
    const {
      title,
      gender,
      firstName,
      middleName,
      lastName,
      displayName,
      dateOfBirth,
      nationality,
      language,
      country,
      province,
      promoCode,
      password,
      confirmPassword,
      receiveNewsletters,
      agreeTerms
    } = body;

    console.log("🚀 [REGISTER] Step2 Data - Name:", firstName, lastName, "DOB:", dateOfBirth);

    // Kiểm tra các trường bắt buộc bước 2
    if (!title || !gender || !firstName || !lastName || !displayName ||
        !dateOfBirth || !nationality || !language || !country || !province ||
        !password || !confirmPassword) {
      console.error("❌ THIẾU TRƯỜNG BẮT BUỘC:", {
        title: !!title,
        gender: !!gender,
        firstName: !!firstName,
        lastName: !!lastName,
        displayName: !!displayName,
        dateOfBirth: !!dateOfBirth,
        nationality: !!nationality,
        language: !!language,
        country: !!country,
        province: !!province,
        password: !!password,
        confirmPassword: !!confirmPassword
      });
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin cá nhân bắt buộc.' },
        { status: 400 }
      );
    }

    // VALIDATE ENUM VALUES
    const validTitles = ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof', 'Other'];
    const validGenders = ['Male', 'Female', 'Other'];
    const validLanguages = ['vi', 'en', 'ja', 'ko', 'zh'];

    if (!validTitles.includes(title)) {
      console.error("❌ INVALID TITLE:", title);
      return NextResponse.json(
        { message: 'Danh xưng không hợp lệ.' },
        { status: 400 }
      );
    }

    if (!validGenders.includes(gender)) {
      console.error("❌ INVALID GENDER:", gender);
      return NextResponse.json(
        { message: 'Giới tính không hợp lệ.' },
        { status: 400 }
      );
    }

    if (!validLanguages.includes(language)) {
      console.error("❌ INVALID LANGUAGE:", language);
      return NextResponse.json(
        { message: 'Ngôn ngữ không hợp lệ.' },
        { status: 400 }
      );
    }

    // VALIDATION PASSWORD
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 8 ký tự.' },
        { status: 400 }
      );
    }
    
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: 'Mật khẩu phải chứa ít nhất một chữ hoa.' },
        { status: 400 }
      );
    }
    
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: 'Mật khẩu phải chứa ít nhất một chữ thường.' },
        { status: 400 }
      );
    }
    
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { message: 'Mật khẩu phải chứa ít nhất một số.' },
        { status: 400 }
      );
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' },
        { status: 400 }
      );
    }

    // VALIDATION CONFIRM PASSWORD
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Mật khẩu xác nhận không khớp.' },
        { status: 400 }
      );
    }

    // VALIDATION ĐIỀU KHOẢN
    if (!agreeTerms) {
      return NextResponse.json(
        { message: 'Bạn phải đồng ý với điều khoản và điều kiện để tiếp tục.' },
        { status: 400 }
      );
    }

    // VALIDATION DATE OF BIRTH
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      console.error("❌ INVALID DATE OF BIRTH:", dateOfBirth);
      return NextResponse.json(
        { message: 'Ngày sinh không hợp lệ.' },
        { status: 400 }
      );
    }

    // Validate age (must be at least 12 years old)
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isOldEnough = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()))
      ? age - 1 >= 12
      : age >= 12;

    if (!isOldEnough) {
      console.error("❌ USER NOT OLD ENOUGH:", age);
      return NextResponse.json(
        { message: 'Bạn phải đủ 12 tuổi để đăng ký.' },
        { status: 400 }
      );
    }

    // 6. KIỂM TRA USER TỒN TẠI (song song cho email và phone để tối ưu hiệu suất)
    let existingUser;
    try {
      // Sử dụng truy vấn đơn giản hơn vì email đã được lowercase và unique
      existingUser = await User.findOne({
        $or: [
          { email: email },
          { phoneNumber: phoneNumber }
        ]
      });
    } catch (dbError: any) {
      console.error('❌ Lỗi khi kiểm tra user tồn tại:', dbError);
      console.error('Error details:', JSON.stringify(dbError, null, 2));
      return NextResponse.json(
        { message: 'Lỗi khi kiểm tra thông tin tài khoản.' },
        { status: 500 }
      );
    }

    if (existingUser) {
      const existingEmail = existingUser.email || '';
      const existingPhone = existingUser.phoneNumber || '';

      if (existingEmail === email) {
        return NextResponse.json(
          { message: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' },
          { status: 409 }
        );
      }

      if (existingPhone === phoneNumber) {
        return NextResponse.json(
          { message: 'Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { message: 'Email hoặc số điện thoại đã được đăng ký.' },
        { status: 409 }
      );
    }

    // 7. HASH MẬT KHẨU
    let hashedPassword;
    try {
      // Giảm salt rounds từ 10 xuống 8 để cải thiện hiệu suất (vẫn an toàn)
      hashedPassword = await bcrypt.hash(password, 8);
    } catch (hashError: any) {
      console.error('Lỗi khi hash mật khẩu:', hashError);
      return NextResponse.json(
        { message: 'Lỗi khi xử lý mật khẩu.' },
        { status: 500 }
      );
    }

    // 8. TẠO USER MỚI VỚI ĐẦY ĐỦ THÔNG TIN
    let newUser;
    try {
      const userData = {
        // Bước 1: Thông tin liên lạc
        email: email.toLowerCase(),
        phoneAreaCode: phoneAreaCode,
        phoneNumber: phoneNumber,

        // Bước 2: Thông tin cá nhân
        title: title,
        gender: gender,
        firstName: firstName.trim(),
        middleName: middleName?.trim() || '',
        lastName: lastName.trim(),
        displayName: displayName.trim(),
        dateOfBirth: birthDate,
        nationality: nationality.trim(),
        language: language,
        country: country.trim(),
        province: province.trim(),
        promoCode: promoCode?.trim() || '',

        // Bảo mật
        password: hashedPassword,

        // Tùy chọn
        receiveNewsletters: receiveNewsletters || false,
        agreeTerms: agreeTerms,

        // Hệ thống (sẽ tự động tạo membershipNumber)
        role: 'user',
        membershipTier: 'Silver'
      };

      newUser = new User(userData);
      await newUser.save();
      console.log("✅ User created successfully:", newUser._id);
    } catch (saveError: any) {
      console.error('❌ Lỗi khi lưu user:', saveError.message);
      
      // Xử lý lỗi duplicate key từ MongoDB
      if (saveError.code === 11000) {
        const field = Object.keys(saveError.keyPattern || {})[0];

        if (field === 'email') {
          return NextResponse.json(
            { message: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' },
            { status: 409 }
          );
        }
        if (field === 'phoneNumber') {
          return NextResponse.json(
            { message: 'Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác.' },
            { status: 409 }
          );
        }
        if (field === 'membershipNumber') {
          // Nếu membershipNumber trùng lặp, thử lại với số ngẫu nhiên khác
          try {
            const year = new Date().getFullYear();
            const random = Math.floor(100000 + Math.random() * 900000);
            newUser.membershipNumber = `BSV${year}${random}`;
            await newUser.save();
          } catch (retryError: any) {
            return NextResponse.json(
              { message: 'Lỗi hệ thống khi tạo số hội viên. Vui lòng thử lại.' },
              { status: 500 }
            );
          }
        }
        return NextResponse.json(
          { message: 'Thông tin đã tồn tại trong hệ thống.' },
          { status: 409 }
        );
      }

      // Xử lý lỗi validation từ Mongoose
      if (saveError.name === 'ValidationError') {
        const messages = Object.values(saveError.errors || {}).map((val: any) => val.message);
        return NextResponse.json(
          { message: messages.join(' ') || 'Dữ liệu không hợp lệ.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: 'Lỗi khi tạo tài khoản. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // 9. TẠO JWT TOKEN
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
    if (!process.env.JWT_SECRET) {
      console.warn("⚠️ WARNING: JWT_SECRET is not defined in .env file. Using fallback key (NOT SECURE FOR PRODUCTION)");
    }

    let token;
    try {
      token = jwt.sign(
        { 
          userId: newUser._id.toString(), 
          email: newUser.email, 
          role: newUser.role,
          membershipNumber: newUser.membershipNumber
        },
        jwtSecret,
        { expiresIn: '1h' }
      );
    } catch (tokenError: any) {
      console.error('Lỗi khi tạo JWT token:', tokenError);
      return NextResponse.json(
        { message: 'Lỗi khi tạo token xác thực.' },
        { status: 500 }
      );
    }

    // 10. TRẢ VỀ KẾT QUẢ THÀNH CÔNG
    const userForResponse = {
      _id: newUser._id,
      email: newUser.email,
      phoneAreaCode: newUser.phoneAreaCode,
      phoneNumber: newUser.phoneNumber,
      fullName: newUser.fullName,
      displayName: newUser.displayName,
      membershipNumber: newUser.membershipNumber,
      membershipTier: newUser.membershipTier,
      role: newUser.role,
      title: newUser.title,
      gender: newUser.gender,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      nationality: newUser.nationality,
      language: newUser.language,
      country: newUser.country,
      province: newUser.province
    };

    return NextResponse.json(
      { 
        message: 'Đăng ký hội viên Bông Sen Vàng thành công!', 
        user: userForResponse, 
        token 
      },
      { status: 201 }
    );

  } catch (error: any) {
    // Outer catch-all để đảm bảo không có lỗi nào làm sập server
    console.error('LỖI ĐĂNG KÝ CHI TIẾT (OUTER CATCH):', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Xử lý các lỗi cụ thể
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return NextResponse.json(
        { message: 'Không thể kết nối đến database. Vui lòng thử lại sau.' },
        { status: 503 }
      );
    }

    if (error.name === 'MongooseError') {
      return NextResponse.json(
        { message: 'Lỗi database. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Lỗi không xác định - đảm bảo luôn trả về JSON response
    return NextResponse.json(
      { message: 'Đã có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
