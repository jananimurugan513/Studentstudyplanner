import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LayoutDashboard, BookOpen, CheckSquare, Calendar, LogOut, Sun, Moon, Menu, X } from "lucide-react";
import "./Layout.css";

const Layout = ({ children }) => {
  const { dispatch, user } = useContext(AuthContext);
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const navItems = [
    { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/subjects", name: "Subjects", icon: <BookOpen size={20} /> },
    { path: "/tasks", name: "Tasks", icon: <CheckSquare size={20} /> },
    { path: "/exams", name: "Exams", icon: <Calendar size={20} /> },
  ];

  return (
    <div className="layout">
      {/* Mobile Topbar */}
      <div className="mobile-topbar hidden-desktop">
        <h2 className="logo">StudyPlanner</h2>
        <button className="icon-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${mobileMenuOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo hidden-mobile">StudyPlanner</h2>
        </div>

        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          
          <div className="sidebar-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="icon-btn logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
