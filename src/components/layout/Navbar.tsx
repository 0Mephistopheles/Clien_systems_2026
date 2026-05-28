import { NavLink, Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initials } from '../../utils/format';

const navItems = [
  { to: '/games', label: 'Games' },
  { to: '/leaderboards', label: 'Leaderboards' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { isAuthenticated, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <Link to="/" className="brand-mark">
          <span className="brand-mark__logo">MMP</span>
          <span className="brand-mark__text">
            Multiplayer Mini Games
            <small>Realtime battle hub</small>
          </span>
        </Link>
      </div>

      <nav className="topbar__nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            {item.label}
          </NavLink>
        ))}
        {isAuthenticated ? (
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Profile
          </NavLink>
        ) : null}
        {profile?.role === 'admin' ? (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Admin
          </NavLink>
        ) : null}
      </nav>

      <div className="topbar__actions">
        <Button variant="ghost" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? '☀' : '☾'}
        </Button>
        {isAuthenticated ? (
          <>
            <div className="topbar__avatar" title={profile?.username ?? 'Player'}>
              {initials(profile?.username ?? 'Player')}
            </div>
            <Button variant="secondary" onClick={() => void logout()}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">
              Sign in
            </Link>
            <Link className="btn btn--primary btn--md" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
