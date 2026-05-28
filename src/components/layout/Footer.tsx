import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/games', label: 'Games' },
  { to: '/leaderboards', label: 'Leaderboards' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="footer__brand">Multiplayer Mini Games Platform</p>
        <p className="footer__copy">
          Supabase-backed realtime mini games hub built for modern Web Development labs.
        </p>
      </div>
      <nav className="footer__nav" aria-label="Footer">
        {footerLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
