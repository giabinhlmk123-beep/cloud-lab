import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });

  // Câu 47: Gọi API GET /api/students để lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Câu 49: Gửi dữ liệu từ React đến API POST /api/students
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // Reset form và tải lại danh sách sinh viên
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi thêm sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Quản lý Sinh viên</h2>

      {/* Câu 48: Tạo Form nhập MSSV, Họ tên và Email sử dụng React State và input */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Mã số sinh viên (MSSV)" 
          value={formData.studentId} 
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} 
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          type="text" 
          placeholder="Họ tên" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Thêm sinh viên</button>
      </form>

      {/* Giao diện hiển thị danh sách sinh viên (Câu 47) */}
      <h3>Danh sách sinh viên</h3>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            <b>{s.studentId}</b> - {s.name} ({s.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;