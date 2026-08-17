const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Student = require('./models/Student');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Câu 36 API GET lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);
// Câu 37 API POST thêm sinh viên mới
app.post('/api/students', async (req, res) => {
    try{    
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);
// Câu 38 API PUT cập nhật sinh viên theo ID
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);
// Câu 39 API DELETE xóa sinh viên theo ID
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với trang chủ Server!');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});