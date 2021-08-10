const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const planSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  quantity: Number,
  resultName: String,
  recurrence: String,
}); 

planSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Plan', planSchema);