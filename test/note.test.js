const mongoose = require('mongoose')
const Note = require('../models/Note')
const { initialNotes, api, server, getAllContentFromNotes } = require('./helper')

beforeEach(async () => {
  await Note.deleteMany({})

  // parallet
  /* const noteObjects = initialNotes.map(note => new Note(note))
  const promises = noteObjects.map(note => note.save())
  await Promise.all(promises) */
  // series

  for (const note of initialNotes) {
    const noteObjects = new Note(note)
    await noteObjects.save()
  }
})

describe('GET Notes', () => {
  test('are return as json', async () => {
    await api
      .get('/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two', async () => {
    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the first should match the added one', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain(initialNotes[0].content)
  })
})

describe('POST Notes,', () => {
  test('valid can added', async () => {
    const newNote = {
      content: 'proximamente async/await',
      important: true
    }

    await api
      .post('/post')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)

    expect(contents).toContain(newNote.content)
  })

  test('without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/post')
      .send(newNote)
      .expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE Notes,', () => {
  test('can be removed', async () => {
    const { response: firstResponse } =
    await getAllContentFromNotes()

    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
      .delete(`/delete/${noteToDelete.id}`)
      .expect(204)

    const { response: secondResponse, ids } =
    await getAllContentFromNotes()

    expect(secondResponse.body)
      .toHaveLength(initialNotes.length - 1)

    expect(ids).not.toContain(noteToDelete.id)
  })

  test('does not exist cannot be deleted', async () => {
    api
      .delete('/delete/123')
      .expect(400)

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.disconnect()
})
