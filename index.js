require('dotenv').config()
require('./mongoose.js')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const Note = require('./models/Note.js')
const notFound = require('./notFound.js')
const handlerErrors = require('./handlerErrors.js')
const usersRouter = require('./controllers/users.js')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hola mundo</h1>')
})

app.get('/json', async (request, response) => {
  try {
    const notes = await Note.find({})
    response.json(notes)
  } catch (error) {
    console.log(error)
  }
})

app.post('/post/', async (request, response) => {
  const { content, important } = request.body

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const note = new Note({
    content,
    important: important || false,
    date: new Date()
  })
  const prom = await note.save()

  response.json(prom)
})

app.get('/exit', (request, response) => {
  mongoose.disconnect()
    .then(() => console.log('servidor desconcectado'))
  response.status(400)
})

app.get('/notes/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    const res = await Note.findById(id)
    response.json(res)
  } catch (error) {
    next(error)
  }
})

app.delete('/delete/:id', async (request, response, next) => {
  const { id } = request.params
  try {
    await Note.deleteOne({ _id: id })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/put/:id', async (request, response, next) => {
  const { id } = request.params
  const { content, important } = request.body

  try {
    const resp = await Note.findByIdAndUpdate(
      id,
      { content, important },
      { new: true })
    response.json(resp)
  } catch (error) {
    next(error)
  }
})

app.use('/api/users', usersRouter)

app.use(notFound)

app.use(handlerErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log('Servidor levantado')
})

module.exports = { app, server }
