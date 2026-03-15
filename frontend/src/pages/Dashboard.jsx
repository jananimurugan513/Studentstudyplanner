import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, CheckSquare, Calendar, Award } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    subjects: 0,
    tasksPending: 0,
    tasksCompleted: 0,
    examsUpcoming: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.accessToken}` } };
        const [subjRes, taskRes, examRes] = await Promise.all([
          axios.get("http://localhost:5000/api/subjects", config),
          axios.get("http://localhost:5000/api/tasks", config),
          axios.get("http://localhost:5000/api/exams", config)
        ]);
        
        const tasks = taskRes.data;
        setStats({
          subjects: subjRes.data.length,
          tasksPending: tasks.filter(t => t.status === "Pending").length,
          tasksCompleted: tasks.filter(t => t.status === "Completed").length,
          examsUpcoming: examRes.data.length
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [user]);

  const completionRate = stats.tasksPending + stats.tasksCompleted === 0 
    ? 0 
    : Math.round((stats.tasksCompleted / (stats.tasksPending + stats.tasksCompleted)) * 100);

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: "1rem" }}>
        <div>
          <h2>Welcome back, {user?.name.split(" ")[0]}! 👋</h2>
          <p className="text-muted">Here's an overview of your academic progress.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon bg-brand-light">
                <BookOpen size={24} color="var(--brand-primary)" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Subjects</p>
                <h3 className="stat-value">{stats.subjects}</h3>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon bg-warning-light">
                <CheckSquare size={24} color="var(--warning)" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending Tasks</p>
                <h3 className="stat-value">{stats.tasksPending}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-success-light">
                <Award size={24} color="var(--success)" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Tasks Completed</p>
                <h3 className="stat-value">{stats.tasksCompleted}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-danger-light">
                <Calendar size={24} color="var(--danger)" />
              </div>
              <div className="stat-info">
                <p className="stat-label">Upcoming Exams</p>
                <h3 className="stat-value">{stats.examsUpcoming}</h3>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="card highlight-card">
              <h3>Weekly Progress</h3>
              <p className="text-muted">You have completed <strong>{completionRate}%</strong> of your tasks.</p>
              
              <div className="progress-bar-container mt-4">
                <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
              </div>
              <p className="mt-2 text-muted" style={{ fontSize: "0.85rem", textAlign: "right" }}>{stats.tasksCompleted} / {stats.tasksPending + stats.tasksCompleted} Tasks</p>
              
              {completionRate === 100 && stats.tasksCompleted > 0 && (
                <div className="success-banner mt-4">
                  Amazing logic! You're fully caught up with everything! 🚀
                </div>
              )}
            </div>

            <div className="card">
              <h3>Study Preferences</h3>
              <div className="mt-4">
                <div className="pref-item">
                  <span className="pref-label">Daily Goal:</span>
                  <span className="pref-value">{user?.studyPreferences?.dailyGoals || "Not set."}</span>
                </div>
                <div className="pref-item mt-2">
                  <span className="pref-label">Preferred Slots:</span>
                  <span className="pref-value">{user?.studyPreferences?.preferredSlots}</span>
                </div>
                <div className="pref-item mt-2">
                  <span className="pref-label">Available Hours:</span>
                  <span className="pref-value">{user?.studyPreferences?.availableHours} hrs/day</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
