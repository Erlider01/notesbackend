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

describe('GET all Notes', () => {
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

describe('GET note by id,', () => {
  test('must find a note', async () => {
    const { ids: idFirst, response } = await getAllContentFromNotes()
    const id = idFirst[0]

    const data = await api.get(`/notes/${id}`)
    expect(data.body.id).toBe(response.body[0].id)
  })
  test('error if invalid argument is passed', async () => {
    const response = await api
      .get('/notes/1234')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.ErrorName).toBe('CastError')
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

describe('PUT by id,', () => {
  test('if the id exists, you can change the content', async () => {
    let { ids } = await getAllContentFromNotes()
    ids = ids[0]

    const contentTemp = {
      content: 'changeContain'
    }

    const response = await api
      .put(`/put/${ids}`)
      .send(contentTemp)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: responseFinaly } = await getAllContentFromNotes()

    expect(response.body.content).toBe(contentTemp.content)
    expect(response.body.id).toBe(ids)
    expect(responseFinaly.body[0].content).toBe(contentTemp.content)
    expect(responseFinaly.body[0].id).toBe(response.body.id)
  })

  test('if the id exists, you can change content and important', async () => {
    let { ids } = await getAllContentFromNotes()
    ids = ids[0]

    const contentTemp = {
      content: 'changeContain',
      important: false
    }

    const response = await api
      .put(`/put/${ids}`)
      .send(contentTemp)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { response: responseFinaly } = await getAllContentFromNotes()

    expect(response.body.content).toBe(contentTemp.content)
    expect(response.body.important).toBe(contentTemp.important)
    expect(response.body.id).toBe(ids)

    expect(responseFinaly.body[0].content).toBe(contentTemp.content)
    expect(responseFinaly.body[0].important).toBe(contentTemp.important)
    expect(responseFinaly.body[0].id).toBe(response.body.id)
  })

  test('If the id does not exist, you cannot change content', async () => {
    const contentTemp = {
      content: 'changeContain',
      important: false
    }

    const response = await api
      .put('/put/123456')
      .send(contentTemp)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.ErrorName).toBe('CastError')

    const { contents } = await getAllContentFromNotes()

    expect(contents).not.toContain(contentTemp.content)
  })
})

afterAll(() => {
  server.close()
  mongoose.disconnect()
})
