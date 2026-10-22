import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎟️</span>
          EventHub
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Events
          </NavLink>
          {user && (
            <NavLink to="/my-tickets" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              My Tickets
            </NavLink>
          )}
          {user && (
            <NavLink to="/create-event" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              + Create Event
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="nav-user">
              <span className="user-badge">👤 {user.name}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
