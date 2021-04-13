const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs.map(blog =>blog.toJSON()))
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


module.exports = blogsRouter