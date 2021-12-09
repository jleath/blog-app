const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });

  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1, id: 1 });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.user._id,
  });

  if (blog.title || blog.url) {
    const result = await blog.save();
    request.user.blogs = request.user.blogs.concat(result._id);
    await request.user.save();
    response.status(201).json(result);
  } else {
    response.status(400).end();
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'user not authorized to delete this blog' });
  }
  await blog.remove();
  request.user.blogs = request.user.blogs.filter(b => b !== blog.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };
  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  if (!updated) {
    response.status(404).end();
  } else {
    response.json(updated);
  }
});

module.exports = blogsRouter;