import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  getTracks,
  createTrack,
  updateTrack,
  deleteTrack,
  getReleases,
  getSamples,
  attachSampleToTrack,
  detachSampleFromTrack,
} from "../../api/api";
import { Track, Release, Sample } from "../../types";

const empty = { title: "", release_id: "", notes: "" };

export default function AdminTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [attachTrackId, setAttachTrackId] = useState<number | null>(null);
  const [attachSampleId, setAttachSampleId] = useState("");

  const load = () =>
    Promise.all([getTracks(), getReleases(), getSamples()])
      .then(([t, r, s]) => {
        setTracks(t);
        setReleases(r);
        setSamples(s);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      release_id: form.release_id ? Number(form.release_id) : null,
      notes: form.notes || null,
    };
    if (editing !== null) {
      await updateTrack(editing, data);
      setEditing(null);
    } else {
      await createTrack(data);
    }
    setForm(empty);
    load();
  };

  const handleEdit = (t: Track) => {
    setEditing(t.id);
    setForm({
      title: t.title,
      release_id: t.release_id ? String(t.release_id) : "",
      notes: t.notes ?? "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this track?")) return;
    await deleteTrack(id);
    load();
  };

  const handleAttach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachTrackId || !attachSampleId) return;
    await attachSampleToTrack(Number(attachSampleId), attachTrackId);
    setAttachTrackId(null);
    setAttachSampleId("");
    load();
  };

  const handleDetach = async (trackId: number, sampleId: number) => {
    await detachSampleFromTrack(sampleId, trackId);
    load();
  };

  const inputClass =
    "bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full";

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Tracks</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-xl"
      >
        <h2 className="font-semibold">
          {editing !== null ? "Edit track" : "Add track"}
        </h2>
        <input
          className={inputClass}
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          className={inputClass}
          value={form.release_id}
          onChange={(e) => setForm({ ...form, release_id: e.target.value })}
        >
          <option value="">— Release —</option>
          {releases.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
              {r.artist ? ` – ${r.artist}` : ""}
            </option>
          ))}
        </select>
        <textarea
          className={inputClass}
          placeholder="Notes"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            {editing !== null ? "Save" : "Add"}
          </button>
          {editing !== null && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
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
        <div className="flex flex-col gap-3">
          {tracks.map((t) => (
            <div key={t.id} className="bg-gray-800 rounded-lg px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-medium">{t.title}</span>
                  {t.release_title && (
                    <span className="text-gray-400 text-sm ml-3">
                      {t.release_title}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAttachTrackId(t.id);
                      setAttachSampleId("");
                    }}
                    className="text-green-400 hover:text-green-300 text-sm transition-colors"
                  >
                    + Sample
                  </button>
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {attachTrackId === t.id && (
                <form onSubmit={handleAttach} className="flex gap-2 mt-2">
                  <select
                    className="bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    value={attachSampleId}
                    onChange={(e) => setAttachSampleId(e.target.value)}
                    required
                  >
                    <option value="">— Select sample —</option>
                    {samples.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.source_title ? ` (${s.source_title})` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Attach
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachTrackId(null)}
                    className="text-gray-400 hover:text-white text-sm px-2 transition-colors"
                  >
                    ✕
                  </button>
                </form>
              )}

              {t.samples && t.samples.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.samples.map((s: any) => (
                    <span
                      key={s.id}
                      className="flex items-center gap-1 bg-gray-700 rounded-full px-3 py-0.5 text-xs text-gray-300"
                    >
                      {s.name}
                      <button
                        onClick={() => handleDetach(t.id, s.id)}
                        className="text-gray-500 hover:text-red-400 ml-1 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
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
