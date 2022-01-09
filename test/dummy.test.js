const listHelper = require('../utils/list_helper')
const blogs = [
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
    }
]
describe('test blog', () => {
    test('dummy returns one', () => {
      const blogsVacio = []
    
      const result = listHelper.dummy(blogsVacio)
      expect(result).toBe(1)
    })

    test('likes blog', () => {
        const blogs = [
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
            }
        ]
      
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(22)
      })

      test('favorite blog', () => {
        const blogs = [
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
        const result = listHelper.favoriteBlog(blogs)
          expect(result).toEqual({    
            "title": "Cuarto Post",
            "author": "Tadeo Tiraboschi",
            "url": "url pruebas",
            "likes": 24
        })
      })


  

})