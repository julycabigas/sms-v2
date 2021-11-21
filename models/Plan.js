const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const planSchema = new mongoose.Schema({
  amount: mongoose.Schema.Types.Decimal128,
  currency: String,
  quantity: Number,
  resultName: String,
  recurrence: String,
}); 

planSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Plan', planSchema);