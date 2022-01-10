const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregatePaginate = require('mongoose-paginate-v2');

const noteSchema = new mongoose.Schema({
  creator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  },
  note: { type: String, default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true })

noteSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Note', noteSchema);