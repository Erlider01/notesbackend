const { app, server } = require('../index')
const supertest = require('supertest')
const api = supertest(app)

const initialNotes = [
  {
    content: 'aprendo backend con jose',
    important: true,
    date: new Date()
  },
  {
    content: 'me gusta programar',
    important: false,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/json')
  const { body: notes } = response
  return {
    contents: notes.map(note => note.content),
    response,
    ids: notes.map(note => note.id)

  }
}

module.exports = {
  initialNotes,
  api,
  server,
  getAllContentFromNotes
}
