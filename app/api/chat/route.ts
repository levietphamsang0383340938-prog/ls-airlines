import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lấy API key từ biến môi trường
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Chưa cấu hình Gemini API Key. Vui lòng thêm GEMINI_API_KEY vào file .env.local' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Tin nhắn không được để trống' },
        { status: 400 }
      );
    }

    // Chọn model Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Đặt System Instruction để định hình tính cách cho NEO
    const systemPrompt = `Bạn là LEO, trợ lý ảo AI độc quyền của trang web đặt vé máy bay LS Airlines.
LƯU Ý CỰC KỲ QUAN TRỌNG: Bạn CHỈ được phép trả lời các câu hỏi liên quan ĐÚNG đến tính năng của trang web này (đặt vé máy bay, tra cứu chuyến bay, quy định hành lý, hạng ghế, thanh toán, thông tin chuyến bay của LS Airlines).
TUYỆT ĐỐI KHÔNG trả lời bất kỳ câu hỏi nào ngoài lề (như code, toán học, lịch sử, chính trị, dịch thuật, tư vấn tình cảm...). Nếu khách hàng hỏi ngoài lề, hãy trả lời lịch sự rằng: "Xin lỗi, LEO là trợ lý hàng không của LS Airlines nên chỉ hỗ trợ các thông tin về đặt vé và chuyến bay. Quý khách có cần hỗ trợ gì về dịch vụ của hãng không ạ?".
Hãy trả lời ngắn gọn, súc tích và luôn giữ thái độ nhiệt tình.`;

    // Gọi API của Gemini
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hãy đóng vai theo kịch bản sau: " + systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Vâng, tôi đã hiểu. Tôi là LEO, trợ lý ảo của LS Airlines. Tôi sẵn sàng hỗ trợ quý khách." }],
        }
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
}
