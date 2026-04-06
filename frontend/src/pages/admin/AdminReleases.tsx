import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getReleases, createRelease, updateRelease, deleteRelease, getTypesByCategory } from '../../api/api';
import { Release, Type } from '../../types';

const empty = { title: '', artist: '', year: '', type_id: '', notes: '' };

export default function AdminReleases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    Promise.all([getReleases(), getTypesByCategory('release')])
      .then(([r, t]) => { setReleases(r); setTypes(t); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      artist: form.artist || null,
      year: form.year ? Number(form.year) : null,
      type_id: form.type_id ? Number(form.type_id) : null,
      notes: form.notes || null,
    };
    if (editing !== null) {
      await updateRelease(editing, data);
      setEditing(null);
    } else {
      await createRelease(data);
    }
    setForm(empty);
    load();
  };

  const handleEdit = (r: Release) => {
    setEditing(r.id);
    setForm({
      title: r.title,
      artist: r.artist ?? '',
      year: r.year ? String(r.year) : '',
      type_id: r.type_id ? String(r.type_id) : '',
      notes: r.notes ?? '',
    });
  };

  const handleDelete = async (r: Release) => {
    const count = r.track_count ?? 0;
    const warning = count > 0
      ? `Warning: this release has ${count} linked track${count !== 1 ? 's' : ''} that will lose their release reference.\n\n`
      : '';
    if (!window.confirm(`${warning}Delete "${r.title}"?`)) return;
    await deleteRelease(r.id);
    load();
  };

  const inputClass = "bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full";

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Releases</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-xl">
        <h2 className="font-semibold">{editing !== null ? 'Edit release' : 'Add release'}</h2>
        <input className={inputClass} placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input className={inputClass} placeholder="Artist" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
        <input className={inputClass} placeholder="Year" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
        <select className={inputClass} value={form.type_id} onChange={e => setForm({ ...form, type_id: e.target.value })}>
          <option value="">— Type —</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.text}</option>)}
        </select>
        <textarea className={inputClass} placeholder="Notes" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors">
            {editing !== null ? 'Save' : 'Add'}
          </button>
          {editing !== null && (
            <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="text-gray-400 hover:text-white text-sm px-4 py-2 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="flex flex-col gap-2">
          {releases.map(r => (
            <div key={r.id} className="bg-gray-800 rounded-lg px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{r.title}</span>
                <span className="text-gray-400 text-sm ml-3">{r.artist}</span>
                <span className="text-gray-500 text-sm ml-2">{r.year}</span>
                {r.type_text && <span className="text-gray-500 text-xs ml-2">{r.type_text}</span>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(r)} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">Edit</button>
                <button onClick={() => handleDelete(r)} className="text-red-400 hover:text-red-300 text-sm transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
