import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './StudentDetail.css'; // Import file CSS cho trang chi tiết

function StudentDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết của một sinh viên
    fetch(`http://localhost:3000/students/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Student not found');
        }
        return response.json();
      })
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Đang tải thông tin sinh viên...</div>;
  }

  if (error) {
    return <div className="error">Có lỗi xảy ra: {error.message}</div>;
  }

  if (!student) {
    return <div className="error">Không tìm thấy sinh viên.</div>;
  }

  return (
    <div className="student-detail-container">
      <h1>{student.student_name}</h1>
      <p>Mã sinh viên: {student.student_id}</p>
      {/* Hiển thị các thông tin khác của sinh viên */}
    </div>
  );
}

export default StudentDetail;