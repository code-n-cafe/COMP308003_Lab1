import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SignOutFooter from "../components/SignOutFooter";
import CourseCard from "../components/CourseCard";

// type Course = {
//   _id: string;
//   courseCode: string;
//   courseName?: string;
//   section?: string;
// };

type Enrollment = {
  _id: string;        // enrollment id
  section: string;
  course: {
    _id: string;
    courseCode: string;
    courseName?: string;
  };
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newSection, setNewSection] = useState("");

  const getHeaders = () => {
    const token =
      user?.token ??
      (() => {
        try {
          const raw = localStorage.getItem("user");
          return raw ? (JSON.parse(raw) as any).token : undefined;
        } catch {
          return undefined;
        }
      })();
    return token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" };
  };

  async function loadCourses() {
    // don't attempt if not logged in yet
    const token = getHeaders().Authorization;
    if (!token) {
      setCourses([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/students/me/courses", { headers: getHeaders() });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) setCourses(Array.isArray(body.data) ? body.data : []);
      else if (res.ok && Array.isArray(body)) setCourses(body);
      else {
        console.error("Failed loading courses:", body || await res.text());
        setCourses([]);
      }
    } catch (err) {
      console.error("Error loading courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newCourseCode) return;
    try {
      const res = await fetch(`/api/students/me/courses/${encodeURIComponent(newCourseCode)}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ section: newSection || undefined }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) {
        setNewCourseCode("");
        setNewSection("");
        await loadCourses();
      } else {
        alert(body?.error || body?.message || "Add failed");
      }
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  }

  async function handleDrop(courseCode: string) {
    try {
      const res = await fetch(`/api/students/me/courses/${encodeURIComponent(courseCode)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) await loadCourses();
      else alert(body?.error || body?.message || "Drop failed");
    } catch (err) {
      console.error(err);
      alert("Drop failed");
    }
  }

  async function handleUpdate(courseCode: string) {
    const section = prompt("New section:");
    if (!section) return;
    try {
      const res = await fetch(`/api/students/me/courses/${encodeURIComponent(courseCode)}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ section }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.success) await loadCourses();
      else alert(body?.error || body?.message || "Update failed");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Student Dashboard</h1>
      <p>Welcome{user?.email ? `, ${user.email}` : ""}</p>

      <section style={{ marginTop: 16 }}>
        <h3>Add Course</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, maxWidth: 600 }}>
          <input
            placeholder="Course code (e.g., COMP308)"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <input
            placeholder="Section (optional)"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            style={{ width: 120 }}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Your Courses</h3>
        {loading ? (
          <div>Loading...</div>
        ) : courses.length === 0 ? (
          <div>No courses enrolled.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {courses.map((c) => (
              <CourseCard
                key={c._id}
                id={c._id}
                code={c.course.courseCode}
                name={c.course.courseName}
                section={c.section}
                onDrop={() => handleDrop(c.course.courseCode)}
                onEdit={() => handleUpdate(c.course.courseCode)}
              />
            ))}
          </div>
        )}
      </section>
      <section>
        <SignOutFooter />
      </section>
    </div>
  );
};

export default StudentDashboard;