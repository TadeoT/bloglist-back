const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)


describe('blogs multitest', () => {
  beforeAll(async () => {
    await User.deleteMany({})
    
    const newUser = {
      username: 'mluukkai',
      rol: 'USER',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
  
    const user = await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const idUser = user.body.id
    console.log(idUser)


  })
  beforeEach(async () => {
      await Blog.deleteMany({})
      const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)

    })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)

      
  })

  test('blogs are returned length', async () => {
      const response = await api.get('/api/blogs')
      
      expect(response.body).toHaveLength(helper.initialBlogs.length)
      
  })

  test('blogs have id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })

  })

  test('new blog', async () => {
    const newBlog = {
      title: 'Blog test',
      author: 'Jest',
      url: 'urltest',
      likes: 13
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await  api.get('/api/blogs')
    const contents = response.body.map( r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'Blog test'
    )

  })

  test('new blog 0 likes', async () => {
    const newBlog = {
      title: '0 likes Blog',
      author: 'Jest',
      url: 'urltest 0 likes',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await  api.get('/api/blogs')
    const returnedNewBlog = response.body[ response.body.length - 1]

    expect(returnedNewBlog.likes).toEqual(0)


  })

  test('new blog bad request', async () => {
    const newBlog = {
      title: 'no Author Blog',
      url: 'urltest 0 likes',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root',rol: 'ADMIN',name: 'test123', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      rol: 'USER',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      rol: 'USER',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username or password have less than 3 caracters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testlessthan3',
      rol: 'USER',
      name: 'Superuser',
      password: 'un',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is shorter than the minium allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
afterAll(() => {
  mongoose.connection.close()
})