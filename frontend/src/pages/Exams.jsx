import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Plus, Trash2, Calendar, Clock } from "lucide-react";
import "./Subjects.css"; // Reuse modal and grid classes

const Exams = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    subject: "", 
    examDate: "", 
    time: "", 
    duration: 120 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examRes, subjRes] = await Promise.all([
        axios.get("http://localhost:5000/api/exams", { headers: { Authorization: `Bearer ${user.accessToken}` } }),
        axios.get("http://localhost:5000/api/subjects", { headers: { Authorization: `Bearer ${user.accessToken}` } })
      ]);
      setExams(examRes.data);
      setSubjects(subjRes.data);
      if(subjRes.data.length > 0) {
        setFormData(prev => ({ ...prev, subject: subjRes.data[0].name }));
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/exams", formData, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setShowModal(false);
      setFormData({ subject: subjects[0]?.name || "", examDate: "", time: "", duration: 120 });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/exams/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Upcoming Exams</h2>
          <p className="text-muted">Prepare and track your important tests</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Schedule Exam
        </button>
      </div>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="grid-container">
          {exams.map((exam) => (
            <div className="card subject-card" key={exam._id} style={{ borderTop: "4px solid var(--warning)" }}>
              <div className="card-header">
                <h3>{exam.subject}</h3>
                <div className="card-actions">
                  <button className="icon-btn danger" onClick={() => handleDelete(exam._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                <Calendar size={16} color="var(--text-secondary)" />
                <span className="subject-detail" style={{ marginBottom: 0 }}>
                  {new Date(exam.examDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Clock size={16} color="var(--text-secondary)" />
                <span className="subject-detail" style={{ marginBottom: 0 }}>
                  {exam.time} ({exam.duration} mins)
                </span>
              </div>
            </div>
          ))}
          {exams.length === 0 && <p className="text-muted">No upcoming exams.</p>}
        </div>
      )}

      {/* Modal Backdrop & Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Schedule Exam</h3>
            {subjects.length === 0 ? (
              <p className="error-text">Please add a subject first before scheduling an exam.</p>
            ) : (
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Subject</label>
                  <select id="subject" className="input-base" onChange={handleChange} value={formData.subject} required>
                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Exam Date</label>
                  <input type="date" id="examDate" className="input-base" value={formData.examDate} onChange={handleChange} required />
                </div>
                <div className="form-group row-group" style={{ display: "flex", gap: "1rem" }}>
                  <div className="half-width" style={{ flex: 1 }}>
                    <label>Time</label>
                    <input type="time" id="time" className="input-base" value={formData.time} onChange={handleChange} required />
                  </div>
                  <div className="half-width" style={{ flex: 1 }}>
                    <label>Duration (Mins)</label>
                    <input type="number" id="duration" className="input-base" value={formData.duration} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Schedule</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
