const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const planSchema = new mongoose.Schema({
  amount: mongoose.Schema.Types.Decimal128,
  currency: String,
  quantity: Number,
  resultName: String,
  recurrence: String,
  deleted: Boolean,
}); 

planSchema.plugin(mongoosePaginate);

planSchema.pre('save', async function (next) {
  if(!this.isModified('deleted')) {
    next()
  }
  this.deleted = false;
})

module.exports = mongoose.model('Plan', planSchema);