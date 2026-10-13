import { Request, Response } from 'express'; // Giả định sử dụng Express.js cho controllers
import mongoose from 'mongoose';
import Flight, { IFlight } from '../models/Flight';
import FareClass, { IFareClass } from '../models/FareClass';
import Booking, { IBooking } from '../models/Booking';
import { IPassenger } from '../models/PassengerSchema'; // Để kiểm tra kiểu
import { createClient } from 'redis'; // Để sử dụng Redis client

// --- Cấu hình Redis Client (Ví dụ - điều chỉnh theo thiết lập thực tế của bạn) ---
// Trong một ứng dụng thực tế, client này sẽ được khởi tạo một lần và truyền đi hoặc import.
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().then(() => console.log('Redis Connected')).catch(console.error);

// --- Hàm tiện ích ---

// Hàm tạo mã PNR 6 ký tự duy nhất
const generatePNR = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // Trong một hệ thống thực tế, bạn cũng cần kiểm tra tính duy nhất trong DB
  return result;
};

// --- Logic API Controller ---

export const createBooking = async (req: Request, res: Response) => {
  // Bắt đầu một session giao dịch Mongoose để đảm bảo tính nguyên tử
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId,
      flightId,
      passengers, // Mảng các IPassenger
      fareClassSelections, // Mảng các { fareClassId: string, quantity: number }
    } = req.body;

    // 1. Xác thực đầu vào cơ bản
    if (!userId || !flightId || !passengers || passengers.length === 0 || !fareClassSelections || fareClassSelections.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đặt vé.' });
    }

    // Xác thực dữ liệu hành khách (ví dụ: định dạng ngày sinh, các trường cơ bản)
    for (const passenger of passengers) {
      if (!passenger.fullName || !passenger.dob) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Thông tin hành khách không hợp lệ: thiếu tên hoặc ngày sinh.' });
      }
      // Có thể thêm xác thực ngày sinh chi tiết hơn ở đây
    }

    // 2. Lấy thông tin chi tiết Chuyến bay và Hạng vé
    const flight = await Flight.findById(flightId).session(session);
    if (!flight) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
    }

    // Lấy tất cả các tài liệu FareClass liên quan để có giá và tổng số ghế
    const fareClassIds = fareClassSelections.map((sel: any) => sel.fareClassId);
    const fareClasses = await FareClass.find({ _id: { $in: fareClassIds }, flight: flightId }).session(session);

    if (fareClasses.length !== fareClassIds.length) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Một hoặc nhiều hạng vé không hợp lệ cho chuyến bay này.' });
    }

    const fareClassMap = new Map<string, IFareClass>();
    fareClasses.forEach(fc => fareClassMap.set(fc._id.toString(), fc));

    // 3. Kiểm tra số ghế còn trống & Tính tổng số tiền
    let totalAmount = 0;
    const bookingFareClassDetails: IBooking['fareClassSelections'] = [];

    for (const selection of fareClassSelections) {
      const fareClass = fareClassMap.get(selection.fareClassId);
      if (!fareClass) {
        // Trường hợp này lý tưởng nên được bắt bởi kiểm tra fareClasses.length ở trên, nhưng là một biện pháp bảo vệ
        await session.abortTransaction();
        return res.status(400).json({ message: `Hạng vé ${selection.fareClassId} không hợp lệ.` });
      }

      const availableSeats = flight.availableSeatsByClass.get(selection.fareClassId) || 0;

      if (availableSeats < selection.quantity) {
        await session.abortTransaction();
        return res.status(409).json({ message: `Không đủ ghế hạng ${fareClass.className}. Chỉ còn ${availableSeats} ghế.` });
      }

      const pricePerPassenger = fareClass.basePrice + fareClass.taxes;
      totalAmount += pricePerPassenger * selection.quantity;

      bookingFareClassDetails.push({
        fareClass: new mongoose.Types.ObjectId(selection.fareClassId),
        quantity: selection.quantity,
        pricePerPassenger: pricePerPassenger,
      });
    }

    // Đảm bảo tổng số hành khách khớp với tổng số lượng từ fareClassSelections
    const totalSelectedSeats = fareClassSelections.reduce((sum: number, sel: any) => sum + sel.quantity, 0);
    if (passengers.length !== totalSelectedSeats) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Số lượng hành khách không khớp với số lượng ghế đã chọn.' });
    }

    // 4. Tạo PNR
    let pnr = generatePNR();
    // Trong một hệ thống thực tế, bạn sẽ lặp và kiểm tra xem PNR có tồn tại trong DB không, tạo lại nếu có.
    // Để đơn giản, chúng ta giả định nó đủ duy nhất cho ví dụ này.

    // 5. Giảm số ghế trong Chuyến bay (Cập nhật nguyên tử)
    const updateOperations: { [key: string]: number } = {};
    for (const selection of fareClassSelections) {
      updateOperations[`availableSeatsByClass.${selection.fareClassId}`] = -selection.quantity;
    }

    const updatedFlight = await Flight.findByIdAndUpdate(
      flightId,
      { $inc: updateOperations },
      { new: true, session: session } // `new: true` trả về tài liệu đã cập nhật
    );

    if (!updatedFlight) {
      await session.abortTransaction();
      return res.status(500).json({ message: 'Không thể cập nhật số lượng ghế chuyến bay.' });
    }

    // 6. Tạo Booking
    const newBooking = new Booking({
      pnr,
      user: new mongoose.Types.ObjectId(userId),
      flight: new mongoose.Types.ObjectId(flightId),
      passengers: passengers,
      fareClassSelections: bookingFareClassDetails,
      totalAmount,
      status: 'PENDING_PAYMENT', // Trạng thái mặc định là PENDING_PAYMENT
    });

    await newBooking.save({ session: session });

    // 7. Giữ chỗ trong Redis với TTL (15 phút = 900 giây)
    // Lưu thông tin tối thiểu cần thiết cho logic nhả ghế
    await redisClient.setEx(`hold:booking:${pnr}`, 900, JSON.stringify({
      flightId: flightId.toString(),
      fareClassSelections: bookingFareClassDetails.map(sel => ({
        fareClassId: sel.fareClass.toString(),
        quantity: sel.quantity
      }))
    }));

    await session.commitTransaction(); // Hoàn tất giao dịch

    res.status(201).json({
      message: 'Đặt vé thành công, đang chờ thanh toán.',
      booking: newBooking,
      pnr: newBooking.pnr,
    });

  } catch (error: any) {
    await session.abortTransaction(); // Hủy giao dịch nếu có lỗi
    console.error('Lỗi khi tạo đặt vé:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đặt vé.', error: error.message });
  } finally {
    session.endSession(); // Kết thúc session giao dịch
  }
};

// --- Logic nhả ghế (Release Seat) ---
// Phần này thường chạy trong một tiến trình riêng biệt hoặc một worker chuyên dụng,
// lắng nghe các sự kiện hết hạn của khóa Redis.

export const setupRedisExpirationListener = async () => {
  // Client này dành riêng để đăng ký nhận thông báo key-space
  const subscriberClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  subscriberClient.on('error', (err) => console.error('Redis Subscriber Client Error', err, 'Vui lòng đảm bảo Redis `notify-keyspace-events` được đặt thành `Ex` hoặc `KEA`'));
  await subscriberClient.connect();

  // Cấu hình Redis để phát ra thông báo key-space cho các khóa đã hết hạn
  // Trong môi trường sản xuất, điều này nên được cấu hình trong redis.conf hoặc thông qua `CONFIG SET`
  // Đối với phát triển, bạn có thể chạy `CONFIG SET notify-keyspace-events Ex` trong redis-cli
  await subscriberClient.sendCommand(['CONFIG', 'SET', 'notify-keyspace-events', 'Ex']);
  console.log('Redis đã được cấu hình cho các sự kiện hết hạn khóa.');

  subscriberClient.subscribe('__keyevent@0__:expired', async (message, channel) => {
    console.log(`Redis key expired: ${message} on channel ${channel}`);
    if (message.startsWith('hold:booking:')) {
      const pnr = message.split(':')[2];
      console.log(`Đang xử lý giữ chỗ đã hết hạn cho PNR: ${pnr}`);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const booking = await Booking.findOne({ pnr }).session(session);

        if (booking && booking.status === 'PENDING_PAYMENT') {
          console.log(`Booking ${pnr} đang ở trạng thái PENDING_PAYMENT, đánh dấu là EXPIRED và nhả ghế.`);
          booking.status = 'EXPIRED';
          await booking.save({ session: session });

          const flight = await Flight.findById(booking.flight).session(session);
          if (flight) {
            const updateOperations: { [key: string]: number } = {};
            for (const selection of booking.fareClassSelections) {
              updateOperations[`availableSeatsByClass.${selection.fareClass.toString()}`] = selection.quantity;
            }
            await Flight.findByIdAndUpdate(
              booking.flight,
              { $inc: updateOperations },
              { session: session }
            );
            console.log(`Ghế cho booking ${pnr} đã được trả lại cho chuyến bay ${flight.flightCode}.`);
          } else {
            console.warn(`Không tìm thấy chuyến bay ${booking.flight} cho booking hết hạn ${pnr}. Ghế có thể không được nhả.`);
          }
        } else if (booking) {
          console.log(`Trạng thái Booking ${pnr} là ${booking.status}, không cần hành động nhả ghế.`);
        } else {
          console.log(`Không tìm thấy Booking với PNR ${pnr}.`);
        }
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        console.error(`Lỗi khi xử lý giữ chỗ đã hết hạn cho PNR ${pnr}:`, error);
      } finally {
        session.endSession();
      }
    }
  });
  console.log('Đang lắng nghe các sự kiện hết hạn khóa Redis...');
};

// Ví dụ về cách gọi hàm này trong điểm vào ứng dụng chính của bạn (ví dụ: server.ts)
// import { setupRedisExpirationListener } from './controllers/booking.controller';
// setupRedisExpirationListener();