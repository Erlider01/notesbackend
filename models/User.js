const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userShema = new Schema({
  username: String,
  name: String,
  password: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

userShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.password
  }
})

const User = model('User', userShema)

module.exports = User
