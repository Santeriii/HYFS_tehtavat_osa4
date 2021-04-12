var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0

    blogs.map(blog => {
        likes = likes + blog.likes
    })

    return likes
}

const favoriteBlog = (blogs) => {
    let favorite = ''
    let maxLikes = 0

    blogs.map(blog => {
        if (blog.likes > maxLikes) {
            favorite = blog
            maxLikes = blog.likes
        }
    })

    return favorite
}

const mostBlogs = (blogs) => {
    let authorArray = _.map(blogs,'author')
    let mostCommonAuthor = _.chain(authorArray).countBy().toPairs().max(_.last).head().value()
    let authorCount = 0

    blogs.map(blog => {
        if (mostCommonAuthor === blog.author) {
            authorCount = authorCount + 1
        }
    })

    const authorWithMostBlogs = {
        author: mostCommonAuthor,
        blogs: authorCount
    }

    return authorWithMostBlogs
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}