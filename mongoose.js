const mongoose = require('mongoose')
const password = 'Porfin01.'

const connectionString = process.env.MONGODB_URI

mongoose.connect(connectionString).then(() => {
  console.log('Database connected')
})
/*   mongoose.disconnect()
    .then(() => console.log('Database Disconnect'))
 */
