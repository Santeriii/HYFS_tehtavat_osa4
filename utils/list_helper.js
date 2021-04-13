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

const mostLikes = (blogs) => {
    let authors = []
    blogs.map(b => {
        authors.push({
            author: b.author,
            likes: 0
        })
    })

    blogs.map(b => {
        let author = authors.find(a => a.author === b.author)
        let index = authors.indexOf(author)

        author = ({...author, likes: author.likes + b.likes})
        authors[index] = author
    })

    let likeCount = 0
    let authorWithMostLikes = ''

    authors.map(a => {
        if (a.likes > likeCount) {
            likeCount = a.likes
            authorWithMostLikes = a
        }
    })

    return authorWithMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}