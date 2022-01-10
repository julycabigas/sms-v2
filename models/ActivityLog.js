const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const activityLogSchema = new Schema({
  time: { 
    type: Date, 
    default: null 
  },
  type: { 
    type: Object, 
    default: null 
  },
  reference: {
    type: Object,
    default: null,
  },
  user : { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updates: {
    type: Array,
    default: null,
  }
}, { timestamps: true })

activityLogSchema.plugin(paginate);

module.exports = mongoose.model('ActivityLog', activityLogSchema);