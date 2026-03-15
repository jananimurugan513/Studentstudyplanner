import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Plus, Trash2, Edit } from "lucide-react";
import "./Subjects.css";

const Subjects = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", teacher: "", creditHours: 3 });

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/subjects", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/subjects", formData, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setShowModal(false);
      setFormData({ name: "", teacher: "", creditHours: 3 });
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>My Subjects</h2>
          <p className="text-muted">Manage your academic classes</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Subject
        </button>
      </div>

      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <div className="grid-container">
          {subjects.map((subject) => (
            <div className="card subject-card" key={subject._id}>
              <div className="card-header">
                <h3>{subject.name}</h3>
                <div className="card-actions">
                  <button className="icon-btn danger" onClick={() => handleDelete(subject._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="subject-detail"><strong>Teacher:</strong> {subject.teacher || "N/A"}</p>
              <p className="subject-detail"><strong>Credits:</strong> {subject.creditHours}</p>
            </div>
          ))}
          {subjects.length === 0 && <p className="text-muted">No subjects added yet.</p>}
        </div>
      )}

      {/* Modal Backdrop & Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Subject</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Subject Name</label>
                <input type="text" id="name" className="input-base" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Teacher</label>
                <input type="text" id="teacher" className="input-base" value={formData.teacher} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Credit Hours</label>
                <input type="number" id="creditHours" className="input-base" value={formData.creditHours} onChange={handleChange} min="1" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
