import { Link, useLocation, useNavigate } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/releases', label: 'Releases' },
  { to: '/admin/tracks', label: 'Tracks' },
  { to: '/admin/sources', label: 'Sources' },
  { to: '/admin/samples', label: 'Samples' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded text-sm transition-colors ${
      location.pathname === path
        ? 'bg-gray-700 text-white font-semibold'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <aside className="w-52 bg-gray-900 flex flex-col p-4 gap-1 shrink-0">
        <div className="text-white font-bold text-lg mb-6 px-4">Admin</div>
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={linkClass(l.to)}>
            {l.label}
          </Link>
        ))}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Log out
          </button>
          <Link to="/" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Public site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 text-white overflow-auto">{children}</main>
    </div>
  );
}
