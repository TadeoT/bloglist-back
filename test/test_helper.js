const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {    
        "title": "Primer Post",
        "author": "Tadeo Tiraboschi",
        "url": "url pruebas",
        "likes": 12
    },
    {    
        "title": "segundo Post",
        "author": "Tadeo Tiraboschi",
        "url": "url pruebas",
        "likes": 6
    },
    {    
        "title": "tercer Post",
        "author": "Tadeo Tiraboschi",
        "url": "url pruebas",
        "likes": 4
    },
    {    
        "title": "Cuarto Post",
        "author": "Tadeo Tiraboschi",
        "url": "url pruebas",
        "likes": 24
    }
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
    const blog = await Blog.find({})
    return blog.map(blog => blog.toJSON())
  }
  

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
  }
