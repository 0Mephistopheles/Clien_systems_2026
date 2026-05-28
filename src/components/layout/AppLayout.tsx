import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
