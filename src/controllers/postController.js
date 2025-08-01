const {Post,createPost,getAllPosts} = require('../models/postModel');
const { getCachedFeed, setCachedFeed,invalidateFeedCache } = require('../cache/feedCache');
// Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      createdBy: req.user.id,
    });
        await invalidateFeedCache(); // Invalidate cache after creating a post

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Post creation failed', error: err.message });
  }
};


exports.getFeed = async function(req, res) {
  try {
    const cachedFeed = await getCachedFeed();
    if (cachedFeed) {
      return res.json({ source: 'cache', data: cachedFeed });
    }

    const posts = await getAllPosts();
    await setCachedFeed(posts);

    res.json({ source: 'db', data: posts });
  } catch (err) {
    console.error('Fetch Feed Error:', err);
    res.status(500).json({ error: 'Internal server error' });
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
        await invalidateFeedCache(); // Invalidate cache after updating a post
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
     await invalidateFeedCache(); // Invalidate cache after deleting a post

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
