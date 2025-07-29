const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

module.exports = router;
