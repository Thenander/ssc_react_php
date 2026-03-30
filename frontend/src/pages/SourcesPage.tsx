import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSources } from '../api/api';
import { Source } from '../types';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSources()
      .then(setSources)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Sources</h1>
      {sources.length === 0 && (
        <p className="text-gray-400">No sources yet.</p>
      )}
      <ul className="flex flex-col gap-3">
        {sources.map((s) => (
          <li key={s.id}>
            <Link
              to={`/sources/${s.id}`}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-5 py-4"
            >
              <div>
                <div className="text-white font-semibold">{s.title}</div>
                {s.producer && <div className="text-gray-400 text-sm">{s.producer}</div>}
              </div>
              <div className="text-right text-sm text-gray-400">
                {s.year && <div>{s.year}</div>}
                {s.type_text && <div>{s.type_text}</div>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
