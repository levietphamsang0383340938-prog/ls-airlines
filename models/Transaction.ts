import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'DEPOSIT' | 'PAYMENT';
  amount: number;
  description: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'PAYMENT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'SUCCESS'
  }
}, { 
  timestamps: true 
});

// Sử dụng mongoose.models.Transaction để tránh lỗi OverwriteModelError khi hot-reloading
export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
