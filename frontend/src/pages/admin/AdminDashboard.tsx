import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const sections = [
  { to: '/admin/releases', label: 'Releases', desc: 'Add and manage releases' },
  { to: '/admin/tracks', label: 'Tracks', desc: 'Add and manage tracks' },
  { to: '/admin/sources', label: 'Sources', desc: 'Add and manage sources' },
  { to: '/admin/samples', label: 'Samples', desc: 'Add and manage samples' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-w-xl">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl p-5"
          >
            <div className="font-semibold text-white">{s.label}</div>
            <div className="text-gray-400 text-sm mt-1">{s.desc}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
