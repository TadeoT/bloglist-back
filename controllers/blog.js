const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')
const jwt = require('jsonwebtoken')

const decodedToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  return decodedToken.id
}
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
    
  })
  
blogRouter.post('/', async (request, response) => {
    const token = getTokenFrom(request)
    const idUser = decodedToken(token)
    const user = await User.findById(idUser)

    if(user){
      const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: user._id
      })
        
      blogSaved = await blog.save()
      user.blogs = user.blogs.concat(blogSaved._id)
      await user.save()
      
      response.json(blogSaved)
    }

  })

 blogRouter.delete('/:id', async (request, response) => {
    const token = getTokenFrom(request)
    const idUser = decodedToken(token)
    const user = await User.findById(idUser)
    const blog = await Blog.findById(request.params.id)
    if(blog === null){
      return response.status(401).json({ error: 'blog id no found' })
    }
    if (blog.user.toString() === user.id.toString() ) {
      result = await Blog.findByIdAndRemove(request.params.id)
      console.log(result)
      return response.status(204).end()
    }
    response.status(401).json({ error: 'unauthorized user' })
  })

 blogRouter.put('/:id', async (request,response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }
    result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    return response.json(result)
})

module.exports = blogRouter