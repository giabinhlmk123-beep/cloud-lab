import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State quản lý trạng thái chỉnh sửa
  const [editingStudent, setEditingStudent] = useState(null)

  // State quản lý Form nhập sinh viên
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  })

  // URL Backend API (Gán mặc định URL Backend trên Render)
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-backend-238050-568q.onrender.com'
  // Dùng đường dẫn tương đối cho Nginx Reverse Proxy
  const API_URL = '/api/students';

  // Hàm tải danh sách sinh viên
  const fetchStudents = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể kết nối đến Backend API')
        return res.json()
      })
      .then((data) => {
        setStudents(data)
        setLoading(false)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Xử lý thay đổi dữ liệu trong các ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Chuyển dữ liệu sinh viên lên Form khi bấm nút "Sửa"
  const handleEditClick = (student) => {
    setEditingStudent(student)
    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || ''
    })
  }

  // Hủy bỏ chế độ chỉnh sửa
  const handleCancelEdit = () => {
    setEditingStudent(null)
    setFormData({ studentId: '', name: '', email: '' })
  }

  // Gửi dữ liệu Form (Thêm mới POST hoặc Cập nhật PUT)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingStudent) {
      // Đang ở chế độ Sửa -> Gọi API PUT
      const targetId = editingStudent._id || editingStudent.studentId
      fetch(`${API_URL}/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại!')
          return data
        })
        .then(() => {
          alert('Cập nhật sinh viên thành công!')
          fetchStudents()
          handleCancelEdit()
        })
        .catch((err) => alert(`Lỗi từ Server: ${err.message}`))
    } else {
      // Đang ở chế độ Thêm mới -> Gọi API POST
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || 'Thêm sinh viên thất bại!')
          return data
        })
        .then(() => {
          alert('Thêm sinh viên thành công!')
          fetchStudents()
          setFormData({ studentId: '', name: '', email: '' })
        })
        .catch((err) => alert(`Lỗi từ Server: ${err.message}`))
    }
  }

  // Xử lý Xóa sinh viên (DELETE /api/students/:id)
  const handleDelete = (student) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa sinh viên ${student.name} (MSSV: ${student.studentId}) không?`
    )

    if (confirmDelete) {
      const targetId = student._id || student.studentId

      fetch(`${API_URL}/${targetId}`, {
        method: 'DELETE'
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.message || 'Xóa thất bại!')
          }
          return res.json()
        })
        .then(() => {
          alert('Xóa sinh viên thành công!')
          fetchStudents()
        })
        .catch((err) => alert(`Lỗi từ Server: ${err.message}`))
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Quản lý Sinh viên - Phiên bản 2.0 (Production)</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="studentId"
          placeholder="Mã số sinh viên (MSSV)"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />

        <button type="submit" style={{ padding: '5px 10px', marginRight: '5px' }}>
          {editingStudent ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
        </button>

        {editingStudent && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '5px 10px', background: '#ccc' }}>
            Hủy
          </button>
        )}
      </form>

      <h3>Danh sách sinh viên</h3>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      <ul>
        {students.map((s) => (
          <li key={s._id || s.studentId} style={{ marginBottom: '8px' }}>
            <b>{s.studentId}</b> - {s.name} ({s.email}) &nbsp;&nbsp;
            <button
              onClick={() => handleEditClick(s)}
              style={{ marginRight: '5px', padding: '2px 6px', background: '#f0ad4e', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Sửa
            </button>
            <button
              onClick={() => handleDelete(s)}
              style={{ padding: '2px 6px', background: '#d9534f', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App