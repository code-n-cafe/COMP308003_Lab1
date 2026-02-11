import React, {useState, useEffect} from "react";

type Props ={
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (student: any) => void;
}

const StudentFormModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
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
    strongestSkill: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    if(!isOpen) return null;

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
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/students", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(form),
            });
            const txt = await res.text();
            let body = (() => { try { return JSON.parse(txt); } catch { return txt; }} )();
            if (!res.ok) {
                const message = body?.error || body?.message || txt || "Failed to create student";
                throw new Error(message);
            }
            else {
                onCreated && onCreated(body?.data || body);
                onClose();
                //reset form

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
                    strongestSkill: "",
                });
            }
        } catch (err: any) {
            setError(err?.message || "Failed to create student");
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
            width: "min(900px, 96%)",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#444444",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.25)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Add Student</h3>
          <button onClick={onClose} aria-label="Close">Close</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input required placeholder="Student Number" value={form.studentNumber} onChange={e => handleChange("studentNumber", e.target.value)} style={{ flex: 1 }} />
            <input required placeholder="Email" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} style={{ flex: 1 }} />
            <input required placeholder="Password" type="password" value={form.password} onChange={e => handleChange("password", e.target.value)} style={{ width: 220 }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input required placeholder="First Name" value={form.firstName} onChange={e => handleChange("firstName", e.target.value)} />
            <input required placeholder="Last Name" value={form.lastName} onChange={e => handleChange("lastName", e.target.value)} />
            <input placeholder="Phone" value={form.phoneNumber} onChange={e => handleChange("phoneNumber", e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Address" value={form.address} onChange={e => handleChange("address", e.target.value)} style={{ flex: 1 }} />
            <input placeholder="City" value={form.city} onChange={e => handleChange("city", e.target.value)} style={{ width: 220 }} />
            <input placeholder="Program" value={form.program} onChange={e => handleChange("program", e.target.value)} style={{ width: 220 }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Favorite Topic" value={form.favoriteTopic} onChange={e => handleChange("favoriteTopic", e.target.value)} />
            <input placeholder="Strongest Skill" value={form.strongestSkill} onChange={e => handleChange("strongestSkill", e.target.value)} />
          </div>

          {error && <div style={{ color: "red" }}>{error}</div>}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Student"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;