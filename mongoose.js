const mongoose = require('mongoose')

const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : MONGODB_URI

mongoose.connect(connectionString).then(() => {
  console.log('Database connected')
})

process.on('uncaughtException', () => {
  mongoose.disconnect()
})
