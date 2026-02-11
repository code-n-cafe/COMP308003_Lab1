import React from "react";

interface Props {
  course?: any;
  id?: string;
  code?: string;
  name?: string;
  section?: string;
  onDrop?: () => void;
  onEdit?: () => void;
}

const CourseCard: React.FC<Props> = ({ course, id, code, name, section, onDrop, onEdit }) => {
  const c = course || { _id: id, courseCode: code, courseName: name, section };
  const cardStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    margin: 8,
    width: 320,
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
    background: "#46565e",
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{c.courseName || c.courseCode}</div>
          {c.courseCode && <div style={{ color: "#ffffff" }}>{c.courseCode}</div>}
        </div>
        {c.section && <div style={{ fontSize: 12, color: "#ffffff" }}>Sec {c.section}</div>}
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        {onEdit && <button onClick={onEdit}>Edit</button>}
        {onDrop && <button onClick={onDrop}>Drop</button>}
      </div>
    </div>
  );
};

export default CourseCard;