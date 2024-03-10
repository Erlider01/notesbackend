const { connectDatabase, disconnectDatabase } = require('./mongoose.js')
const express = require('express')
const cors = require('cors')
const Note = require('./models/Note.js')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (require, response) => {
  response.send('<h1>Hola mundo</h1>')
})

app.get('/json', async (require, response) => {
  await connectDatabase()

  try {
    const notes = await Note.find({})
    disconnectDatabase()
    response.json(notes)
  } catch (error) {
    console.log(error)
  }
})

app.post('/post/', async (require, response) => {
  const { content, important } = require.body

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  await connectDatabase()

  const note = new Note({
    content,
    important: important || false,
    date: new Date()
  })

  const prom = await note.save()
  await disconnectDatabase()

  response.json(prom)
})

/* app.get('/notes/:id', (require, response) => {
  const id = Number(require.params.id)
  const res = DATA.find(v => id === v.id)
  if (res) response.json(res)
  else response.status(404).end()
})

app.delete('/delete/:id', (require, response) => {
  const id = Number(require.params.id)

  console.log(id)

  DATA = DATA.filter(v => v.id !== id)
  response.status(204).end()
})

app.post('/post/', (require, response) => {
  const note = require.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = DATA.map(e => e.id)
  const maxId = Math.max(...ids)
  const newDate = {

    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()

  }

  DATA = [...DATA, newDate]
  response.json(note)
}) */

const PORT = process.env.PORT || 3012
app.listen(PORT, () => {
  console.log('Servidor levantado')
})
