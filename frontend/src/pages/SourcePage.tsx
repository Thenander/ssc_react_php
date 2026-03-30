import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSource } from '../api/api';
import { Source } from '../types';

export default function SourcePage() {
  const { id } = useParams<{ id: string }>();
  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSource(Number(id))
      .then(setSource)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!source) return <div className="p-8 text-red-400">Source not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/sources" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
        ← All sources
      </Link>

      <div className="bg-gray-800 rounded-xl px-6 py-5 mb-8">
        <h1 className="text-3xl font-bold text-white">{source.title}</h1>
        <div className="flex gap-4 mt-2 text-gray-400 text-sm">
          {source.producer && <span>{source.producer}</span>}
          {source.year && <span>{source.year}</span>}
          {source.type_text && <span>{source.type_text}</span>}
        </div>
        {source.notes && (
          <p className="mt-4 text-gray-300 text-sm">{source.notes}</p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Samples from this source</h2>
      {(!source.samples || source.samples.length === 0) && (
        <p className="text-gray-400">No samples registered from this source.</p>
      )}
      <ul className="flex flex-col gap-3">
        {source.samples?.map((sample: any) => (
          <li key={sample.id} className="bg-gray-800 rounded-lg px-5 py-4">
            <Link to={`/samples/${sample.id}`} className="text-white font-medium hover:text-blue-300 transition-colors">
              {sample.name}
            </Link>
            {sample.type_text && (
              <div className="text-gray-400 text-xs mt-0.5">{sample.type_text}</div>
            )}
            {sample.notes && (
              <div className="text-gray-300 text-sm mt-2">{sample.notes}</div>
            )}
            {sample.tracks && sample.tracks.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1">
                {sample.tracks.map((track: any) => (
                  <li key={track.id} className="flex items-center justify-between">
                    <Link to={`/tracks/${track.id}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      {track.title}
                    </Link>
                    {track.release_title && (
                      <Link to={`/releases/${track.release_id}`} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
                        {track.release_title}{track.artist ? ` – ${track.artist}` : ''}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
