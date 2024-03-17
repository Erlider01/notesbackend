const User = require('../models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { api, server, getUsers } = require('./helper')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'MiaAngeline',
      password: passwordHash,
      name: 'Mia Jerusalen'
    })

    await user.save()
  })

  test('works as expectd creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'Lider01',
      name: 'jose',
      password: 'lidi@'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  afterAll(() => {
    server.close()
    mongoose.disconnect()
  })
})
