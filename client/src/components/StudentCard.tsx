import React from "react";

interface Props {
  student: any;
  onView?: (s: any) => void;
}

const StudentCard: React.FC<Props> = ({ student, onView }) => {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 12,
      margin: 8,
      background: "#fff"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{student.firstName} {student.lastName}</div>
          <div style={{ color: "#555" }}>{student.email} — {student.studentNumber}</div>
          {student.program && <div style={{ color: "#666" }}>{student.program}</div>}
        </div>
        <div>
          {onView && <button onClick={() => onView(student)}>View</button>}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;