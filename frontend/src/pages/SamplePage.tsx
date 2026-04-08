import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSample } from "../api/api";
import { Sample } from "../types";

export default function SamplePage() {
  const { id } = useParams<{ id: string }>();
  const [sample, setSample] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSample(Number(id))
      .then(setSample)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!sample) return <div className="p-8 text-red-400">Sample not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {sample.source_id && (
        <Link
          to={`/sources/${sample.source_id}`}
          className="text-gray-400 hover:text-white text-sm mb-6 inline-block"
        >
          ← {sample.source_title ?? "Back"}
        </Link>
      )}

      <div className="bg-gray-800 rounded-xl px-6 py-5 mb-8">
        <h1 className="text-3xl font-bold text-white">{sample.name}</h1>
        <div className="flex gap-4 mt-2 text-gray-400 text-sm">
          {sample.type_text && <span>{sample.type_text}</span>}
          {sample.source_title && (
            <span>
              From{" "}
              <Link
                to={`/sources/${sample.source_id}`}
                className="text-blue-400 hover:text-blue-300"
              >
                {sample.source_title}
              </Link>
            </span>
          )}
        </div>
        {sample.notes && (
          <p className="mt-4 text-gray-300 text-sm">{sample.notes}</p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Used in tracks</h2>
      {(!sample.tracks || sample.tracks.length === 0) && (
        <p className="text-gray-400">Not used in any tracks yet.</p>
      )}
      <ul className="flex flex-col gap-2">
        {sample.tracks?.map((track: any) => (
          <li key={track.id}>
            <Link
              to={`/tracks/${track.id}`}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-5 py-3"
            >
              <span className="text-white">{track.title}</span>
              {track.release_title && (
                <span className="text-gray-400 text-sm">
                  {track.release_title}
                  {track.artist ? ` – ${track.artist}` : ""}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
