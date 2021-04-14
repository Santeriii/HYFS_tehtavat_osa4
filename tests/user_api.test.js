const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/blog')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('creation of a faulty user is not possible', () => {
    test('a user with an already existing username is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const existingUser = {
            username: "kale2",
            name: "faulty",
            password: "cndscjjsc"
        }

        const result = await api
            .post('/api/users')
            .send(existingUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('a user with too short username is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithShortUsername = {
            username: "ly",
            name: "Liian Lyhyt",
            password: "vnkslnvj"
        }

        const result = await api
            .post('/api/users')
            .send(userWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('is shorter than the minimum allowed length')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('a user with too short password is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithShortPassword = {
            username: "herkko4",
            name: "Herkko",
            password: "ly"
        }

        const result = await api
            .post('/api/users')
            .send(userWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain("password must consist of atleast three characters")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('a user with no username is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithNoUsername = {
            name: "Ei Käyttäjätunnusta",
            password: "snjvnsdvnjs"
        }

        const result = await api
            .post('/api/users')
            .send(userWithNoUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('a user with no password is not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithNoPassword = {
            username: "faulty",
            name: "Ei Salasanaa"
        }

        const result = await api
            .post('/api/users')
            .send(userWithNoPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})