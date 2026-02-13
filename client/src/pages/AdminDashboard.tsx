import React, { useEffect, useState } from "react";
import StudentFormModal from "../components/StudentFormModal";
import CourseFormModal from "../components/CourseFormModal";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import StudentCard from "../components/StudentCard";
import SignOutFooter from "../components/SignOutFooter";


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
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

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

  const handleStudentCreated = async (student: any) => {
    // refresh list after a new student is created
    await loadStudents();
  };

  const handleCourseCreated = async (course: any) => {
    // refresh list after a new course is created
    await loadCourses();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button title="Add student" onClick={() => setShowStudentModal(true)} style={{
             borderRadius: 18, fontSize: 20, lineHeight: "20px", alignContent: "center", justifyContent: "center",
          }}>Add Student +</button>
          <button title="Add course" onClick={() => setShowCourseModal(true)} style={{
             borderRadius: 18, fontSize: 20, lineHeight: "20px", alignContent: "center", justifyContent: "center",
          }}>Add Course +</button>
        </h2>
        {/* existing inline add-student form can remain or be removed; modal is primary now */}
        {/* ...existing inline form ... */}
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
      <section>
        <SignOutFooter />
      </section>

      {/* Student modal */}
      <StudentFormModal isOpen={showStudentModal} onClose={() => setShowStudentModal(false)} onCreated={handleStudentCreated} />
      <CourseFormModal isOpen={showCourseModal} onClose={() => setShowCourseModal(false)} onCreated={handleCourseCreated} />
    </div>
  );
};

export default AdminDashboard;
