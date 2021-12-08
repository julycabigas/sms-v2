const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const paymentList = new mongoose.Schema({
  due_date: { type: Date, default: null, },
  date_paid: { type: Date, default: null, },
  amount: { type: Schema.Types.Decimal128, default: null, },
  status: { type: String, default: 'Pending', },
  currency: { type: String, default: null, },
  is_deleted: { type: Boolean, default: false },
  student : { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  plan : { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
}, { timestamps: true }); 

paymentList.plugin(aggregatePaginate);

module.exports = mongoose.model('PaymentList', paymentList);