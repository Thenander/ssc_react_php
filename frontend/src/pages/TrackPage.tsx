import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTrack } from '../api/api';
import { Track } from '../types';

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getTrack(Number(id))
      .then(setTrack)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!track) return <div className="p-8 text-red-400">Track not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {track.release_id && (
        <Link
          to={`/releases/${track.release_id}`}
          className="text-gray-400 hover:text-white text-sm mb-6 inline-block"
        >
          ← {track.release_title ?? 'Back'}
        </Link>
      )}

      <div className="bg-gray-800 rounded-xl px-6 py-5 mb-8">
        <h1 className="text-3xl font-bold text-white">{track.title}</h1>
        {track.artist && (
          <div className="text-gray-400 text-sm mt-1">{track.artist}</div>
        )}
        {track.notes && (
          <p className="mt-4 text-gray-300 text-sm">{track.notes}</p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Samples</h2>
      {(!track.samples || track.samples.length === 0) && (
        <p className="text-gray-400">No samples registered for this track.</p>
      )}
      <ul className="flex flex-col gap-3">
        {track.samples?.map((sample) => (
          <li key={sample.id} className="bg-gray-800 rounded-lg px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <Link to={`/samples/${sample.id}`} className="text-white font-medium hover:text-blue-300 transition-colors">
                  {sample.name}
                </Link>
                {sample.type_text && (
                  <div className="text-gray-400 text-xs mt-0.5">{sample.type_text}</div>
                )}
                {sample.notes && (
                  <div className="text-gray-300 text-sm mt-2">{sample.notes}</div>
                )}
              </div>
              {sample.source_title && (
                <Link
                  to={`/sources/${sample.source_id}`}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors ml-4 shrink-0"
                >
                  {sample.source_title}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
