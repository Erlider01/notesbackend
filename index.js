let DATA = [
  {
    id: 1,
    content: 'id labore ex et quam rica cols',
    important: false,
    date: '2024-01-16T04:04:08.101Z'
  },
  {
    id: 2,
    content: 'quo vero reiciendis velit similique earum',
    important: true,
    date: '2024-01-16T04:04:09.101Z'
  },
  {
    id: 3,
    content: 'odio adipisci rerum aut animi',
    important: false,
    date: '2024-01-16T04:04:10.101Z'
  }
]

// con expres
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (require, response) => {
  response.send('<h1>Hola mundo</h1>')
})

app.get('/json', (require, response) => {
  response.json(DATA)
})

app.get('/notes/:id', (require, response) => {
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
})

const PORT = process.env.PORT || 3012
app.listen(PORT, () => {
  console.log('Servidor levantado')
})
