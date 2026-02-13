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
  minWidth: 320,
};

const CourseCard: React.FC<Props> = ({ course, id, code, name, section, onDrop, onEdit }) => {
  const c = course || { _id: id, courseCode: code, courseName: name, section };

  return (
    <div style={cardStyle}>
      <span style={labelStyle}>Course:</span>
      <span style={valueStyle}>{c.courseName || c.courseCode}</span>
      {c.courseCode && (
        <>
          <span style={labelStyle}>Code:</span>
          <span style={valueStyle}>{c.courseCode}</span>
        </>
      )}
      {c.section && (
        <>
          <span style={labelStyle}>Section:</span>
          <span style={valueStyle}>{c.section}</span>
        </>
      )}
      {(onEdit || onDrop) && (
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {onEdit && (
            <button
              style={{
                background: "#2340a0",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                padding: "6px 14px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
              onClick={onEdit}
            >
              Edit
            </button>
          )}
          {onDrop && (
            <button
              style={{
                background: "#a02323",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                padding: "6px 14px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
              onClick={onDrop}
            >
              Drop
            </button>
          )}
        </span>
      )}
    </div>
  );
};

export default CourseCard;