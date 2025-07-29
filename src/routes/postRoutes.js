const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// Create a new post (auth required)
router.post('/', auth, createPost);

// Get all posts (public)
router.get('/', getAllPosts);

// Get a single post by ID (public)
router.get('/:id', getPostById);

// Update a post by ID (auth + ownership required inside controller)
router.put('/:id', auth, updatePost);

// Delete a post by ID (auth + ownership required inside controller)
router.delete('/:id', auth, deletePost);

module.exports = router;
