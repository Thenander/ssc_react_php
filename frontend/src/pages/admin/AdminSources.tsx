import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSources, createSource, updateSource, deleteSource, getTypesByCategory } from '../../api/api';
import { Source, Type } from '../../types';

const empty = { title: '', producer: '', year: '', type_id: '', notes: '' };

export default function AdminSources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    Promise.all([getSources(), getTypesByCategory('source')])
      .then(([s, t]) => { setSources(s); setTypes(t); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      producer: form.producer || null,
      year: form.year ? Number(form.year) : null,
      type_id: form.type_id ? Number(form.type_id) : null,
      notes: form.notes || null,
    };
    if (editing !== null) {
      await updateSource(editing, data);
      setEditing(null);
    } else {
      await createSource(data);
    }
    setForm(empty);
    load();
  };

  const handleEdit = (s: Source) => {
    setEditing(s.id);
    setForm({
      title: s.title,
      producer: s.producer ?? '',
      year: s.year ? String(s.year) : '',
      type_id: s.type_id ? String(s.type_id) : '',
      notes: s.notes ?? '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this source?')) return;
    await deleteSource(id);
    load();
  };

  const inputClass = "bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full";

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Sources</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-xl">
        <h2 className="font-semibold">{editing !== null ? 'Edit source' : 'Add source'}</h2>
        <input className={inputClass} placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input className={inputClass} placeholder="Producer" value={form.producer} onChange={e => setForm({ ...form, producer: e.target.value })} />
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
          {sources.map(s => (
            <div key={s.id} className="bg-gray-800 rounded-lg px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{s.title}</span>
                {s.producer && <span className="text-gray-400 text-sm ml-3">{s.producer}</span>}
                {s.year && <span className="text-gray-500 text-sm ml-2">{s.year}</span>}
                {s.type_text && <span className="text-gray-500 text-xs ml-2">{s.type_text}</span>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(s)} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 text-sm transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
