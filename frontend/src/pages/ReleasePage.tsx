import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRelease } from '../api/api';
import { Release } from '../types';

export default function ReleasePage() {
  const { id } = useParams<{ id: string }>();
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getRelease(Number(id))
      .then(setRelease)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!release) return <div className="p-8 text-red-400">Release not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
        ← All releases
      </Link>

      <div className="bg-gray-800 rounded-xl px-6 py-5 mb-8">
        <h1 className="text-3xl font-bold text-white">{release.title}</h1>
        <div className="flex gap-4 mt-2 text-gray-400 text-sm">
          {release.artist && <span>{release.artist}</span>}
          {release.year && <span>{release.year}</span>}
          {release.type_text && <span>{release.type_text}</span>}
        </div>
        {release.notes && (
          <p className="mt-4 text-gray-300 text-sm">{release.notes}</p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Tracks</h2>
      {(!release.tracks || release.tracks.length === 0) && (
        <p className="text-gray-400">No tracks on this release.</p>
      )}
      <ul className="flex flex-col gap-2">
        {release.tracks?.map((track, i) => (
          <li key={track.id}>
            <Link
              to={`/tracks/${track.id}`}
              className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-5 py-3"
            >
              <span className="text-gray-500 text-sm w-6 text-right">{i + 1}</span>
              <span className="text-white flex-1">{track.title}</span>
              {track.sample_count != null && track.sample_count > 0 && (
                <span className="text-gray-500 text-xs">{track.sample_count} sample{track.sample_count !== 1 ? 's' : ''}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
