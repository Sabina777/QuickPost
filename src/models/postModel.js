const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

// Create a new post
async function createPost({ title, content, createdBy }) {
  const post = new Post({ title, content, createdBy });
  return await post.save();
}

// Get all posts sorted by newest first
async function getAllPosts() {
  return await Post.find().sort({ createdAt: -1 });
}

module.exports = {
  Post,
  createPost,
  getAllPosts,
};
