const mongoose = require('mongoose');
const { Schema } = mongoose;

const depositSchema = new mongoose.Schema({
  amount: { type: Schema.Types.Decimal128, default: null },
  currency: { type: String, default: null },
  date: { type: Date, default: null },
  student : { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true })

module.exports = mongoose.model('Deposit', depositSchema);