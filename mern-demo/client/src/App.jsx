import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  
  // State để theo dõi xem có đang ở chế độ sửa sinh viên nào không
  const [editingId, setEditingId] = useState(null);

  // Gọi API GET /api/students để lấy danh sách sinh viên
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

  // Xử lý Thêm hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Nếu đang sửa -> Gọi API PUT
        await fetch(`http://localhost:5000/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setEditingId(null); // Thoát chế độ sửa
      } else {
        // Nếu thêm mới -> Gọi API POST
        await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      // Reset form và tải lại danh sách sinh viên
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi lưu sinh viên:', err);
    }
  };

  // Đưa thông tin sinh viên lên form để tiến hành sửa
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  // Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  // Xóa sinh viên - Gọi API DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) return;
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE'
      });
      fetchStudents();
    } catch (err) {
      console.error('Lỗi khi xóa sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Quản lý Sinh viên - V2</h2>

      {/* Form nhập liệu (Dùng chung cho cả Thêm mới và Sửa) */}
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
        
        <button type="submit" style={{ padding: '5px 10px', marginRight: '5px' }}>
          {editingId ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '5px 10px', background: '#ccc' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Giao diện hiển thị danh sách sinh viên kèm nút Sửa & Xóa */}
      <h3>Danh sách sinh viên</h3>
      <ul>
        {students.map((s) => (
          <li key={s._id} style={{ marginBottom: '8px' }}>
            <b>{s.studentId}</b> - {s.name} ({s.email}) &nbsp;&nbsp;
            <button 
              onClick={() => handleEditClick(s)} 
              style={{ marginRight: '5px', padding: '2px 6px', background: '#f0ad4e', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Sửa
            </button>
            <button 
              onClick={() => handleDelete(s._id)} 
              style={{ padding: '2px 6px', background: '#d9534f', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;