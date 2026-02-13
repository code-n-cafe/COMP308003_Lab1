import React from "react";

interface Props {
  student: any;
  onView?: (s: any) => void;
}

const labelStyle: React.CSSProperties = {
  color: "#7da6ff",
  fontWeight: 600,
  marginRight: 4,
  fontSize: 13,
};

const valueStyle: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: 600,
  marginRight: 16,
  fontSize: 14,
};

const cardStyle: React.CSSProperties = {
  background: "#1a2236",
  border: "1px solid #2340a0",
  borderRadius: 8,
  padding: "10px 18px",
  margin: "8px 0",
  display: "flex",
  alignItems: "center",
  gap: 18,
  boxShadow: "0 2px 8px #0003",
};

const StudentCard: React.FC<Props> = ({ student, onView }) => {
  return (
    <div style={cardStyle}>
      <span style={labelStyle}>Name:</span>
      <span style={valueStyle}>{student.firstName} {student.lastName}</span>
      <span style={labelStyle}>Email:</span>
      <span style={valueStyle}>{student.email}</span>
      <span style={labelStyle}>Student #:</span>
      <span style={valueStyle}>{student.studentNumber}</span>
      {student.program && (
        <>
          <span style={labelStyle}>Program:</span>
          <span style={valueStyle}>{student.program}</span>
        </>
      )}
      {student.city && (
        <>
          <span style={labelStyle}>City:</span>
          <span style={valueStyle}>{student.city}</span>
        </>
      )}
      {student.phoneNumber && (
        <>
          <span style={labelStyle}>Phone:</span>
          <span style={valueStyle}>{student.phoneNumber}</span>
        </>
      )}
      {onView && (
        <button
          style={{
            marginLeft: "auto",
            background: "#2340a0",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
          }}
          onClick={() => onView(student)}
        >
          View
        </button>
      )}
    </div>
  );
};

export default StudentCard;