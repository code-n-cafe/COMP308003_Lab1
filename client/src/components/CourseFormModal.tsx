import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (course: any) => void;
};

const CourseFormModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    section: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const getHeaders = () => {
    try {
      const raw = localStorage.getItem("user");
      const token = raw ? (JSON.parse(raw) as any).token : undefined;
      return token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };
    } catch {
      return { "Content-Type": "application/json" };
    }
  };

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.courseCode.trim() || !form.courseName.trim()) {
      setError("Course code and name are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        courseCode: form.courseCode.trim(),
        courseName: form.courseName.trim(),
        section: form.section.trim() || undefined,
        semester: form.semester.trim() || undefined,
      };

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const txt = await res.text();
      const body = (() => {
        try { return JSON.parse(txt); } catch { return txt; }
      })();

      if (!res.ok) {
        setError(body?.error || body?.message || String(body) || "Failed to create course");
      } else {
        onCreated && onCreated(body?.data || body);
        onClose();
        setForm({ courseCode: "", courseName: "", section: "", semester: "" });
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000
    }}>
      <div style={{
        width: "min(800px, 96%)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#444444",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Add Course</h3>
          <button onClick={onClose} aria-label="Close">Close</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input required placeholder="Course Code" value={form.courseCode} onChange={e => handleChange("courseCode", e.target.value)} style={{ flex: 1 }} />
            <input required placeholder="Course Name" value={form.courseName} onChange={e => handleChange("courseName", e.target.value)} style={{ flex: 2 }} />
            <input placeholder="Section" value={form.section} onChange={e => handleChange("section", e.target.value)} style={{ width: 120 }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Semester" value={form.semester} onChange={e => handleChange("semester", e.target.value)} style={{ flex: 1 }} />
            <div style={{ flex: 1 }} />
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Course"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;