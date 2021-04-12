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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}