import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  getSamples,
  createSample,
  updateSample,
  deleteSample,
  getSources,
  getTracks,
  getTypesByCategory,
  attachSampleToTrack,
  detachSampleFromTrack,
} from "../../api/api";
import { Sample, Source, Track, Type } from "../../types";

const empty = { name: "", source_id: "", type_id: "", notes: "" };

export default function AdminSamples() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [attachSampleId, setAttachSampleId] = useState<number | null>(null);
  const [attachTrackId, setAttachTrackId] = useState("");
  const [trackSearch, setTrackSearch] = useState("");
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);

  const load = () =>
    Promise.all([
      getSamples(),
      getSources(),
      getTracks(),
      getTypesByCategory("sample"),
    ])
      .then(([sa, so, tr, ty]) => {
        setSamples(sa);
        setSources(so);
        setTracks(tr);
        setTypes(ty);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      source_id: form.source_id ? Number(form.source_id) : null,
      type_id: form.type_id ? Number(form.type_id) : null,
      notes: form.notes || null,
    };
    if (editing !== null) {
      await updateSample(editing, data);
      setEditing(null);
    } else {
      await createSample(data);
    }
    setForm(empty);
    load();
  };

  const handleEdit = (s: Sample) => {
    setEditing(s.id);
    setForm({
      name: s.name,
      source_id: s.source_id ? String(s.source_id) : "",
      type_id: s.type_id ? String(s.type_id) : "",
      notes: s.notes ?? "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this sample?")) return;
    await deleteSample(id);
    load();
  };

  const handleAttach = async (e: React.FormEvent) => {
    console.log(e);

    e.preventDefault();
    if (!attachSampleId || !attachTrackId) return;
    await attachSampleToTrack(attachSampleId, Number(attachTrackId));
    setAttachSampleId(null);
    setAttachTrackId("");
    load();
  };

  const handleDetach = async (sampleId: number, trackId: number) => {
    await detachSampleFromTrack(sampleId, trackId);
    load();
  };

  const inputClass =
    "bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full";

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Samples</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-xl"
      >
        <h2 className="font-semibold">
          {editing !== null ? "Edit sample" : "Add sample"}
        </h2>
        <input
          className={inputClass}
          placeholder="Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          className={inputClass}
          value={form.source_id}
          onChange={(e) => setForm({ ...form, source_id: e.target.value })}
        >
          <option value="">— Source —</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          value={form.type_id}
          onChange={(e) => setForm({ ...form, type_id: e.target.value })}
        >
          <option value="">— Type —</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.text}
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
          {samples.map((s) => (
            <div key={s.id} className="bg-gray-800 rounded-lg px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-medium">{s.name}</span>
                  {s.type_text && (
                    <span className="text-gray-400 text-xs ml-2">
                      {s.type_text}
                    </span>
                  )}
                  {s.source_title && (
                    <span className="text-gray-400 text-sm ml-3">
                      ← {s.source_title}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAttachSampleId(s.id);
                      setAttachTrackId("");
                      setTrackSearch("");
                      setTrackDropdownOpen(false);
                    }}
                    className="text-green-400 hover:text-green-300 text-sm transition-colors"
                  >
                    + Track
                  </button>
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {attachSampleId === s.id && (
                <form onSubmit={handleAttach} className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <input
                      className="bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      placeholder="Search tracks…"
                      value={trackSearch}
                      autoFocus
                      onChange={(e) => {
                        setTrackSearch(e.target.value);
                        setAttachTrackId("");
                        setTrackDropdownOpen(true);
                      }}
                      onFocus={() => setTrackDropdownOpen(true)}
                      onBlur={() =>
                        setTimeout(() => setTrackDropdownOpen(false), 150)
                      }
                    />
                    {trackDropdownOpen && (
                      <ul className="absolute z-10 left-0 right-0 mt-1 bg-gray-700 rounded-lg shadow-lg max-h-56 overflow-y-auto text-sm">
                        {(() => {
                          const q = trackSearch.toLowerCase();
                          const attachedIds = new Set(
                            (s.tracks ?? []).map((at: any) => at.id),
                          );
                          const filtered = tracks.filter(
                            (t) =>
                              t.title.toLowerCase().includes(q) ||
                              (t.release_title ?? "").toLowerCase().includes(q),
                          );
                          const available = filtered.filter(
                            (t) => !attachedIds.has(t.id),
                          );
                          const attached = filtered.filter((t) =>
                            attachedIds.has(t.id),
                          );
                          const all = [...available.slice(0, 30), ...attached];
                          if (all.length === 0)
                            return (
                              <li className="px-3 py-2 text-gray-400">
                                Inga träffar
                              </li>
                            );
                          return all.map((t) => {
                            const alreadyAttached = attachedIds.has(t.id);
                            console.log("attachedIds", attachedIds);
                            console.log("alreadyAttached", alreadyAttached);

                            return (
                              <li
                                key={t.id}
                                className={`px-3 py-2 flex items-center justify-between ${alreadyAttached ? "bg-gray-800 cursor-not-allowed" : "cursor-pointer hover:bg-gray-600 text-white"}`}
                                onMouseDown={
                                  alreadyAttached
                                    ? undefined
                                    : () => {
                                        setAttachTrackId(String(t.id));
                                        setTrackSearch(
                                          `${t.title}${t.release_title ? ` (${t.release_title})` : ""}`,
                                        );
                                        setTrackDropdownOpen(false);
                                      }
                                }
                              >
                                <span
                                  className={
                                    alreadyAttached
                                      ? "line-through text-gray-500"
                                      : ""
                                  }
                                >
                                  {t.title}
                                  {t.release_title && (
                                    <span className="ml-2 text-gray-500">
                                      {t.release_title}
                                    </span>
                                  )}
                                </span>
                                {alreadyAttached && (
                                  <span className="text-xs bg-yellow-700 text-yellow-200 rounded px-1.5 py-0.5 ml-3">
                                    redan tillagd
                                  </span>
                                )}
                              </li>
                            );
                          });
                        })()}
                      </ul>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!attachTrackId}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Attach
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachSampleId(null);
                      setTrackSearch("");
                      setAttachTrackId("");
                    }}
                    className="text-gray-400 hover:text-white text-sm px-2 transition-colors"
                  >
                    ✕
                  </button>
                </form>
              )}

              {s.tracks && s.tracks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.tracks.map((t: any) => (
                    <span
                      key={t.id}
                      className="flex items-center gap-1 bg-gray-700 rounded-full px-3 py-0.5 text-xs text-gray-300"
                    >
                      {t.title}
                      <button
                        onClick={() => handleDetach(s.id, t.id)}
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
