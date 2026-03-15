import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import "./Tasks.css";
import "./Subjects.css"; // Reuse modal and layout classes

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    subject: "", 
    dueDate: "", 
    priority: "Medium", 
    duration: 60 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, subjRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks", { headers: { Authorization: `Bearer ${user.accessToken}` } }),
        axios.get("http://localhost:5000/api/subjects", { headers: { Authorization: `Bearer ${user.accessToken}` } })
      ]);
      setTasks(taskRes.data);
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
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setShowModal(false);
      setFormData({ name: "", subject: subjects[0]?.name || "", dueDate: "", priority: "Medium", duration: 60 });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // Grouping tasks by status
  const pendingTasks = tasks.filter(t => t.status === "Pending");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Assignments & Tasks</h2>
          <p className="text-muted">Track what needs to be done</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Task
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="tasks-layout">
          <div className="task-column pending">
            <h3 className="column-title">To Do ({pendingTasks.length})</h3>
            <div className="task-list">
              {pendingTasks.map((task) => (
                <div className={`card task-card priority-${task.priority.toLowerCase()}`} key={task._id}>
                  <div className="task-header">
                    <button className="icon-btn no-pad" onClick={() => handleToggleStatus(task)}>
                      <Circle size={22} color="var(--text-secondary)" />
                    </button>
                    <div className="task-info">
                      <h4>{task.name}</h4>
                      <div className="task-meta">
                        <span className="badge">{task.subject}</span>
                        <span className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="icon-btn danger" onClick={() => handleDelete(task._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="task-column completed">
            <h3 className="column-title">Completed ({completedTasks.length})</h3>
            <div className="task-list">
              {completedTasks.map((task) => (
                <div className="card task-card completed-task" key={task._id}>
                  <div className="task-header">
                    <button className="icon-btn no-pad" onClick={() => handleToggleStatus(task)}>
                      <CheckCircle size={22} color="var(--success)" />
                    </button>
                    <div className="task-info">
                      <h4>{task.name}</h4>
                      <div className="task-meta">
                        <span className="badge disabled">{task.subject}</span>
                      </div>
                    </div>
                    <button className="icon-btn danger" onClick={() => handleDelete(task._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop & Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Task</h3>
            {subjects.length === 0 ? (
              <p className="error-text">Please add a subject first in the Subjects tab before adding a task.</p>
            ) : (
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Task Name</label>
                  <input type="text" id="name" className="input-base" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select id="subject" className="input-base" onChange={handleChange} value={formData.subject} required>
                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" id="dueDate" className="input-base" value={formData.dueDate} onChange={handleChange} required />
                </div>
                <div className="form-group row-group">
                  <div className="half-width">
                    <label>Priority</label>
                    <select id="priority" className="input-base" onChange={handleChange} value={formData.priority}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="half-width">
                    <label>Est. Drop (Mins)</label>
                    <input type="number" id="duration" className="input-base" value={formData.duration} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Add Task</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
