const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/airlineApp";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create schema
    const BookingHistorySchema = new mongoose.Schema({
      bookingId: { type: String, required: true },
      flightId: { type: String, required: true },
      fullName: { type: String, required: true },
      action: { type: String, required: true },
      reason: { type: String, default: "" },
      price: { type: String, required: true },
      refundAmount: { type: String, default: "0 VND" },
      createdAt: { type: Date, default: Date.now }
    });

    const BookingHistory = mongoose.models.BookingHistory || mongoose.model('BookingHistory', BookingHistorySchema);

    // Insert a record for the cancelled ticket MQGVTW to create the collection
    await BookingHistory.create({
      bookingId: 'MQGVTW',
      flightId: 'VJ 1598',
      fullName: 'Lê Viết Phạm Sang',
      action: 'CANCELLED_BY_USER',
      reason: 'Đổi lịch trình',
      price: '5.446.000 VND',
      refundAmount: '4.901.400 VND'
    });

    console.log('Successfully created bookinghistories collection and seeded 1 record!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
