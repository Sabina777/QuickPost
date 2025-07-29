const Post = require('../models/postModel');

// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      createdBy: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Post creation failed', error: err.message });
  }
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('createdBy', 'username email');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Get Single Post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// Update Post (only if owner)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    const updated = await post.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
