const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const studentSchema = new mongoose.Schema({
  payment_date_start: { type: Date, default: null, },
  joined_date: { type: Date, default: null, },
  signed_contract: { type: String, default: null, },
  payment_method: { type: String, default: null, },
  sales_rep: { type: String, default: null, },
  payment_status: { type: String, default: null, },
  first_name: { type: String, default: null, },
  last_name: { type: String, default: null, },
  email: { type: String, default: null, },
  phone: { type: String, default: null, },
  country: { type: String, default: null, },
  pipeline: { type: String, default: null, },
  funnel: { type: String, default: null, },
  currency: { type: String, default: null, },
  plan: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Plan' },
}, { timestamps: true }); 

studentSchema.index({ 
  first_name: 'text', 
  last_name: 'text', 
  email: 'text', 
});

studentSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Student', studentSchema);