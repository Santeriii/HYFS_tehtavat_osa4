const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs.map(blog =>blog.toJSON()))
})

blogsRouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    res.json(blog.toJSON())
})


blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)
    blog.likes = req.body.likes ? req.body.likes : 0

    if (!blog.title || !blog.url) {
        res.status(400).end()
    }

    const savedBlog = await blog.save()
    res.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        id: body.id
    }

    await Blog.findByIdAndUpdate(req.params.id, blog)
    res.json(blog.toJSON())
})

module.exports = blogsRouter