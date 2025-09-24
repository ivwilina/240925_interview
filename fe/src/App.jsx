import React, { useState, useEffect } from 'react';
import './App.css'; // Import file CSS
import StudentDetail from './StudentDetail.jsx';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sử dụng fetch để gọi API
    fetch('http://localhost:3000/students')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">Có lỗi xảy ra: {error.message}</div>;
  }

  return (
    <div className="container">
      <h1>Danh sách sinh viên</h1>
      <ul className="student-list">
        {students.map(student => (
          <li key={student.student_id} className="student-item">
            {/* Link nội bộ để xem chi tiết sinh viên */}
            <Link to={`/students/${student.student_id}`}>
              {student.student_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/students/:id" element={<StudentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;