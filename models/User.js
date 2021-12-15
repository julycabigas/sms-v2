const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
    default: null,
  },
  contact_number: {
    type: String,
    default: null,
  },
  photo: {
    type: String,
    default: null,
  },
  name: { 
    type: String, 
    default: null 
  },
  email: { 
    type: String, 
    default: null, 
    unique: true, 
  },
  password: { 
    type: String, 
    default: null, 
  },
}, { timestamps: true })

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);