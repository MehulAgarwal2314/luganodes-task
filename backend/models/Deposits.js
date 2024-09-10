import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
  blockNumber: Number,
  blockTimestamp: Date,
  fee: {
    type: Number,
    default: 0,
  },
  hash: String,
  pubkey: String,
});

export default mongoose.model('Deposits', depositSchema);