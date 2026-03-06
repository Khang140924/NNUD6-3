const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// Create (Tạo mới)
router.post('/', async (req, res) => {
  try {
    const newRole = new Role(req.body);
    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read All (Lấy tất cả, trừ những cái đã xóa mềm)
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read by ID (Lấy theo ID)
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update (Cập nhật)
router.put('/:id', async (req, res) => {
  try {
    const updatedRole = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete (Xóa mềm - Chuyển isDeleted thành true)
router.delete('/:id', async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedRole) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json({ message: 'Role deleted softly', role: deletedRole });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;