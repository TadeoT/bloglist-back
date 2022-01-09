const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const arrayBlog = blogs.map( (e) => e.likes)
    return arrayBlog.reduce((a,b) => ( a + b))
  }

const favoriteBlog = (blogs) => {
    return mayorLikes(blogs)
}

const mayorLikes = (blogs) =>{
  blogAux = blogs.shift()
  blogs.forEach(blog => {
    if(blog.likes > blogAux.likes){
      blogAux = blog
    }
  });
  return blogAux
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }
