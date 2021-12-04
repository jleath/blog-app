const totalLikes = blogs => {
  return blogs.reduce((total, curr) => total + curr.likes, 0);
};

const favoriteBlog = blogs => {
  let best = blogs[0];
  blogs.forEach(blog => {
    if (blog.likes > best.likes) {
      best = blog;
    }
  });
  return best;
};

const mostBlogs = blogs => {
  let authors = {};
  let topAuthor = undefined;
  blogs.forEach(blog => {
    authors[blog.author] = authors[blog.author] || 0;
    authors[blog.author]++;
    if (!topAuthor || authors[blog.author] > authors[topAuthor]) {
      topAuthor = blog.author;
    }
  });
  return {
    author: topAuthor,
    blogs: authors[topAuthor],
  };
};

const mostLikes = blogs => {
  let authors = {};
  let topAuthor = undefined;
  blogs.forEach(blog => {
    authors[blog.author] = authors[blog.author] || 0;
    authors[blog.author] += blog.likes;
    if (!topAuthor || authors[blog.author] > authors[topAuthor]) {
      topAuthor = blog.author;
    }
  });
  return {
    author: topAuthor,
    likes: authors[topAuthor],
  };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};