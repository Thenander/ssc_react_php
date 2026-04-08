import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReleases } from "../api/api";
import { Release } from "../types";

export default function Home() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReleases()
      .then(setReleases)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Releases</h1>
      {releases.length === 0 && (
        <p className="text-gray-400">No releases yet.</p>
      )}
      <ul className="flex flex-col gap-3">
        {releases.map((r) => (
          <li key={r.id}>
            <Link
              to={`/releases/${r.id}`}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-5 py-4"
            >
              <div>
                <div className="text-white font-semibold">{r.title}</div>
                {r.sample_count != null && r.sample_count > 0 && (
                  <div className="text-gray-400 text-sm">
                    {r.sample_count} sample{r.sample_count !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <div className="text-right text-sm text-gray-400">
                {r.year && <div>{r.year}</div>}
                {r.type_text && <div>{r.type_text}</div>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
