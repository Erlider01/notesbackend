const mongoose = require('mongoose')
const password = 'Porfin01.'

const connectionString = `mongodb+srv://erlider01:${password}@notes.gzj4cbz.mongodb.net/Database?retryWrites=true&w=majority&appName=Notes`

const connectDatabase = () => {
  mongoose.connect(connectionString).then(() => {
    console.log('Database connected')
  }).catch(err => console.log(err))
}
const disconnectDatabase = () => {
  mongoose.disconnect()
    .then(() => console.log('Database Disconnect'))
}

module.exports = { connectDatabase, disconnectDatabase }
