var express = require('express');
var router = express.Router();

// Bộ nhớ tạm thời (Database ảo)
let users = [];

// Hàm tạo ID ngẫu nhiên cho User giống MongoDB
const generateId = () => Math.random().toString(36).substr(2, 9);

/* --- 1. CRUD OPERATIONS --- */

// CREATE (Tạo user mới)
router.post('/', (req, res) => {
  const { username, password, email, fullName, avatarUrl, role } = req.body;
  
  // Kiểm tra trùng lặp email hoặc username
  const isExist = users.find(u => u.username === username || u.email === email);
  if (isExist) return res.status(400).json({ message: 'Username hoặc Email đã tồn tại' });

  const newUser = {
    _id: generateId(),
    username,
    password,
    email,
    fullName: fullName || "",
    avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: false,
    role: role || null,
    loginCount: 0,
    isDeleted: false,
    timestamp: new Date()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// READ ALL (Lấy danh sách chưa bị xóa mềm)
router.get('/', (req, res) => {
  const activeUsers = users.filter(u => u.isDeleted === false);
  res.status(200).json(activeUsers);
});

// READ BY ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u._id === req.params.id && u.isDeleted === false);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
});

// UPDATE
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u._id === req.params.id && u.isDeleted === false);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  
  // Cập nhật thông tin mới vào user cũ
  users[userIndex] = { ...users[userIndex], ...req.body, timestamp: new Date() };
  res.status(200).json(users[userIndex]);
});

// DELETE (Xóa mềm)
router.delete('/:id', (req, res) => {
  const user = users.find(u => u._id === req.params.id && u.isDeleted === false);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  user.isDeleted = true;
  res.status(200).json({ message: 'User deleted softly', user });
});


/* --- 2 & 3. ENABLE / DISABLE STATUS --- */

// POST /enable
router.post('/enable', (req, res) => {
  const { email, username } = req.body;
  const user = users.find(u => u.email === email && u.username === username && u.isDeleted === false);
  
  if (!user) return res.status(404).json({ message: 'Thông tin không khớp hoặc user không tồn tại' });
  
  user.status = true;
  res.status(200).json({ message: 'Đã cập nhật status thành true', user });
});

// POST /disable
router.post('/disable', (req, res) => {
  const { email, username } = req.body;
  const user = users.find(u => u.email === email && u.username === username && u.isDeleted === false);
  
  if (!user) return res.status(404).json({ message: 'Thông tin không khớp hoặc user không tồn tại' });
  
  user.status = false;
  res.status(200).json({ message: 'Đã cập nhật status thành false', user });
});

module.exports = router;