const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json and to have the correct array length', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the id-field of the blogs is formed correctly', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
})

test('blog addition is succesful', async () => {
    const toBeAdded = {
        title: "New addition",
        author: "Test User",
        url: "www.newaddition.com",
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(toBeAdded)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(b => b.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(
        'New addition'
    )
})

test('if likes-field is not defined the value is set to zero', async () => {
    const blogToAdd = {
        title: "New addition",
        author: "Test User",
        url: "www.newaddition.com"
    }

    await api
        .post('/api/blogs')
        .send(blogToAdd)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')

    const addedBlog = blogs.body.find(b => b.title === "New addition")

    expect(addedBlog.likes).toBe(0)
})

test('title- & url-fields must be defined when adding a blog', async () => {
    const blogToAdd = {
        author: "Test User",
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(blogToAdd)
        .expect(400)
})

test('blog removal is succesful', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
})

test.only('blog modification works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeModified = blogsAtStart[0]
    const modifiedBlog = {...blogToBeModified, likes: blogToBeModified.likes + 1}

    await api
        .put(`/api/blogs/${blogToBeModified.id}`)
        .send(modifiedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toContainEqual(modifiedBlog)
})

afterAll(() => {
    mongoose.connection.close()
})