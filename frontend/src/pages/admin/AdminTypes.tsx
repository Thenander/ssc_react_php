import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getTypes, createType, updateType, deleteType } from '../../api/api';
import { Type } from '../../types';

const CATEGORIES = ['source', 'release', 'sample'] as const;
type Category = typeof CATEGORIES[number];

const empty = { category: 'source' as Category, type: '', text: '' };

export default function AdminTypes() {
  const [types, setTypes] = useState<Type[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () =>
    getTypes()
      .then(setTypes)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editing !== null) {
        await updateType(editing, { type: form.type, text: form.text });
        setEditing(null);
      } else {
        await createType({ category: form.category, type: form.type, text: form.text });
      }
      setForm(empty);
      load();
    } catch {
      setError(editing !== null ? 'Failed to update type.' : 'Failed to create type.');
    }
  };

  const handleEdit = (t: Type) => {
    setEditing(t.id);
    setForm({ category: t.category, type: t.type, text: t.text });
  };

  const handleDelete = async (t: Type) => {
    if (!window.confirm(`Delete "${t.text}"?`)) return;
    await deleteType(t.id);
    load();
  };

  const inputClass = "bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full";

  const grouped = CATEGORIES.reduce<Record<Category, Type[]>>(
    (acc, cat) => { acc[cat] = types.filter(t => t.category === cat); return acc; },
    { source: [], release: [], sample: [] }
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Types</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-xl">
        <h2 className="font-semibold">{editing !== null ? 'Edit type' : 'Add type'}</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <select
          className={inputClass}
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value as Category })}
          disabled={editing !== null}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <input
          className={inputClass}
          placeholder="Type key (e.g. LP, movie) *"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          required
        />
        <input
          className={inputClass}
          placeholder="Display text (e.g. LP, Movie) *"
          value={form.text}
          onChange={e => setForm({ ...form, text: e.target.value })}
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            {editing !== null ? 'Save' : 'Add'}
          </button>
          {editing !== null && (
            <button
              type="button"
              onClick={() => { setEditing(null); setForm(empty); }}
              className="text-gray-400 hover:text-white text-sm px-4 py-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <h2 className="text-lg font-semibold mb-2 capitalize text-gray-300">{cat}</h2>
              {grouped[cat].length === 0 ? (
                <p className="text-gray-500 text-sm">No types yet.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {grouped[cat].map(t => (
                    <div key={t.id} className="bg-gray-800 rounded-lg px-5 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">{t.text}</span>
                        <span className="text-gray-500 text-xs font-mono">{t.type}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">Edit</button>
                        <button onClick={() => handleDelete(t)} className="text-red-400 hover:text-red-300 text-sm transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
