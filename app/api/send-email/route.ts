import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, data } = body; // data có thể là bookingData hoặc userData

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn("GMAIL_USER or GMAIL_PASS is not set in environment variables");
      return NextResponse.json({ success: true, message: 'Simulated email send (missing env credentials)' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let subject = "";
    let htmlTemplate = "";

    if (type === 'WELCOME') {
      subject = "Chào mừng bạn đến với Hệ thống Đặt vé Hàng không";
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #005f73; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Đăng ký thành công!</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${data?.fullName || "Quý khách"}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Tài khoản của bạn đã được tạo thành công trên hệ thống của chúng tôi.</p>
            <p style="font-size: 14px; color: #555;">Giờ đây bạn có thể đăng nhập, đặt vé nhanh chóng và theo dõi toàn bộ lịch sử chuyến bay của mình.</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:3000/login" style="background-color: #005f73; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Đăng nhập ngay</a>
            </div>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      `;
    } else if (type === 'CHANGE_PASSWORD') {
      subject = "Thông báo: Thay đổi mật khẩu thành công";
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #005f73; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Bảo mật tài khoản</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${data?.fullName || "Quý khách"}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Mật khẩu tài khoản Lotusmiles của bạn vừa được thay đổi thành công.</p>
            <p style="font-size: 14px; color: #555;">Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ ngay với tổng đài hỗ trợ của chúng tôi để bảo vệ tài khoản.</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:3000/login" style="background-color: #005f73; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Đăng nhập lại</a>
            </div>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      `;
    } else if (type === 'CANCEL') {
      const bookingData = data.bookingData;
      const cancelReason = data.cancelReason || "Lý do cá nhân";
      const refundAmount = data.refundAmount || "0 VND";
      const cancelFee = data.cancelFee || "0 VND";

      subject = `Xác nhận Hủy vé & Yêu cầu hoàn tiền - PNR: ${bookingData?.bookingId || bookingData?.flightId}`;
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #d32f2f; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Xác nhận Hủy Vé</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Mã đặt chỗ: <strong>${bookingData?.bookingId || bookingData?.flightId}</strong></p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${bookingData?.fullName || "Quý khách"}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Chúng tôi đã nhận được yêu cầu hủy vé chuyến bay của bạn với chi tiết như sau:</p>
            
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Hành trình:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${bookingData?.from} ✈️ ${bookingData?.to}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Mã chuyến bay:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${bookingData?.flightId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Lý do hủy:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #d32f2f;">${cancelReason}</td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding: 15px; border: 1px solid #ffebee; background-color: #fff5f5; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #d32f2f; font-size: 16px;">Chi tiết hoàn tiền</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; color: #555;">Giá vé ban đầu:</td>
                  <td style="padding: 5px 0; text-align: right; color: #333;">${bookingData?.price}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #555;">Phí hủy vé:</td>
                  <td style="padding: 5px 0; text-align: right; color: #d32f2f;">- ${cancelFee}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 5px 0; font-weight: bold; color: #333; border-top: 1px solid #ddd;">Tổng tiền hoàn lại:</td>
                  <td style="padding: 10px 0 5px 0; text-align: right; font-weight: bold; color: #1da040; border-top: 1px solid #ddd;">${refundAmount}</td>
                </tr>
              </table>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #666; text-align: center;">Số tiền sẽ được hoàn lại vào thẻ/ví của bạn trong vòng 7-14 ngày làm việc tới.</p>
            </div>
          </div>
          
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      `;
    } else if (type === 'OTP') {
      const otp = data.otp;
      subject = "Mã xác thực OTP - Quên mật khẩu";
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #005f73; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Khôi phục mật khẩu</h1>
          </div>
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${data?.fullName || "Quý khách"}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Bạn vừa yêu cầu cấp lại mật khẩu cho tài khoản Lotusmiles. Dưới đây là mã xác thực OTP của bạn:</p>
            <div style="margin: 30px 0; text-align: center;">
              <span style="display: inline-block; background-color: #f1f1f1; border: 1px dashed #005f73; color: #005f73; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px 30px; border-radius: 8px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #d32f2f; font-weight: bold; text-align: center;">Lưu ý: Mã OTP này sẽ hết hạn trong vòng 15 phút.</p>
            <p style="font-size: 13px; color: #888; margin-top: 20px;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      `;
    } else {
      // Mặc định là TICKET
      const bookingData = data;
      subject = `Xác nhận đặt vé thành công - PNR: ${bookingData?.bookingId || bookingData?.flightId}`;
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #005f73; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Vé điện tử (E-Ticket)</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Mã đặt chỗ: <strong>${bookingData?.bookingId || bookingData?.flightId}</strong></p>
          </div>
          
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333;">Xin chào <strong>${bookingData?.fullName}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi. Dưới đây là thông tin chi tiết chuyến bay của bạn:</p>
            
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Hành trình:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${bookingData?.from} ✈️ ${bookingData?.to}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Mã chuyến bay:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${bookingData?.flightId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Ngày bay:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${bookingData?.date}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Hạng vé:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${bookingData?.pkg}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #777;">Tổng thanh toán:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #005f73;">${bookingData?.price}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #005f73;">Thông tin dùng để tra cứu vé:</h3>
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #333;"><strong>Mã đặt chỗ (PNR) *</strong><br/>${bookingData?.bookingId || bookingData?.flightId}</p>
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #333;"><strong>Họ hành khách (Không dấu) *</strong><br/>${bookingData?.lastName || 'NGUYEN'}</p>
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #333;"><strong>Số CCCD / Passport (Tùy chọn)</strong><br/>${bookingData?.cccd || '072205005868'}</p>
              <p style="margin: 15px 0 0 0; font-size: 13px; color: #666; text-align: center;">Bạn có thể sử dụng các thông tin trên để tra cứu và làm thủ tục trực tuyến trên website của chúng tôi.</p>
            </div>
          </div>
          
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
            <p style="margin: 5px 0 0 0;">© 2026 Airline Booking System</p>
          </div>
        </div>
      `;
    }

    // Send the email
    const info = await transporter.sendMail({
      from: '"Hệ thống Hàng không" <' + process.env.GMAIL_USER + '>',
      to: email,
      subject: subject,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Lỗi khi gửi email:", error);
    return NextResponse.json({ error: error.message || 'Lỗi gửi mail' }, { status: 500 });
  }
}
