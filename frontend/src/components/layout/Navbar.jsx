import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">Dairy Farm Manager</div>
        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => 
                `hover:text-gray-300 ${isActive ? 'text-blue-400' : ''}`
              }>
                Dashboard
              </NavLink>
              {user.role === 'admin' && (
                <>
                  <NavLink to="/breeds" className={({ isActive }) => 
                    `hover:text-gray-300 ${isActive ? 'text-blue-400' : ''}`
                  }>
                    Breeds
                  </NavLink>
                  <NavLink to="/feeds" className={({ isActive }) => 
                    `hover:text-gray-300 ${isActive ? 'text-blue-400' : ''}`
                  }>
                    Feeds
                  </NavLink>
                  <NavLink to="/health" className={({ isActive }) => 
                    `hover:text-gray-300 ${isActive ? 'text-blue-400' : ''}`
                  }>
                    Health
                  </NavLink>
                </>
              )}
              <NavLink to="/milk" className={({ isActive }) => 
                `hover:text-gray-300 ${isActive ? 'text-blue-400' : ''}`
              }>
                Milk Records
              </NavLink>
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => 
              `hover:text-gray-300 ${isActive ? 'text-blue-400' : ''}`
            }>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
