import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import StudentCard from "../components/StudentCard";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentNumber: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    program: "",
    favoriteTopic: "",
    strongestSkill: ""
  });

  const getHeaders = () => {
    const token = user?.token ?? (() => {
      try {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as any).token : undefined;
      } catch { return undefined; }
    })();
    return token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };
  };

  const normalizeResponse = async (res: Response) => {
    const txt = await res.text();
    try { return JSON.parse(txt); } catch { return txt; }
  };

  async function loadStudents() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students", { headers: getHeaders() });
      const body = await normalizeResponse(res);
      if (res.ok) setStudents(Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : (body?.data || [])));
      else { console.error("loadStudents failed:", body); setStudents([]); }
    } catch (err) { console.error(err); setStudents([]); }
    setLoading(false);
  }

  async function loadCourses() {
    try {
      const res = await fetch("/api/admin/courses", { headers: getHeaders() });
      const body = await normalizeResponse(res);
      if (res.ok) setCourses(Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : (body?.data || [])));
      else { console.error("loadCourses failed:", body); setCourses([]); }
    } catch (err) { console.error(err); setCourses([]); }
  }

  async function loadStudentsForCourse(courseCode: string) {
    if (!courseCode) { await loadStudents(); return; }
    setLoading(true);
    try {
      // try a couple of likely endpoints
      let res = await fetch(`/api/admin/courses/${encodeURIComponent(courseCode)}/students`, { headers: getHeaders() });
      let body = await normalizeResponse(res);
      if (!res.ok) {
        res = await fetch(`/api/admin/students?course=${encodeURIComponent(courseCode)}`, { headers: getHeaders() });
        body = await normalizeResponse(res);
      }
      if (res.ok) setStudents(Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : (body?.data || [])));
      else { console.error("loadStudentsForCourse failed:", body); setStudents([]); }
    } catch (err) { console.error(err); setStudents([]); }
    setLoading(false);
  }

  useEffect(() => { loadStudents(); loadCourses(); }, [user]);

  useEffect(() => { if (selectedCourse) loadStudentsForCourse(selectedCourse); }, [selectedCourse]);

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      const body = await normalizeResponse(res);
      if (res.ok) {
        alert("Student added");
        setForm({
          studentNumber: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          phoneNumber: "",
          program: "",
          favoriteTopic: "",
          strongestSkill: ""
        });
        await loadStudents();
      } else {
        alert(body?.error || body?.message || "Add student failed");
      }
    } catch (err) { console.error(err); alert("Add student failed"); }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>

      <section style={{ marginTop: 16 }}>
        <h2>Add Student</h2>
        <form onSubmit={handleAddStudent} style={{ display: "grid", gap: 8, maxWidth: 800 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Student Number" value={form.studentNumber} onChange={e => setForm({ ...form, studentNumber: e.target.value })} required />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
            <input placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            <input placeholder="Phone" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <input placeholder="Program" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Favorite Topic" value={form.favoriteTopic} onChange={e => setForm({ ...form, favoriteTopic: e.target.value })} />
            <input placeholder="Strongest Skill" value={form.strongestSkill} onChange={e => setForm({ ...form, strongestSkill: e.target.value })} />
            <button type="submit">Add Student</button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Courses</h2>
        <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {courses.map((c) => (
            <div key={c._id} onClick={() => setSelectedCourse(c.courseCode)} style={{ cursor: "pointer" }}>
              <CourseCard course={c} />
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Students {selectedCourse ? `for ${selectedCourse}` : ""}</h2>
        {loading ? <div>Loading...</div> : students.length === 0 ? <div>No students found.</div> : (
          <div style={{ display: "grid", gap: 8 }}>
            {students.map(s => <StudentCard key={s._id || s.studentNumber || s.email} student={s} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
