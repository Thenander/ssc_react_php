import { useEffect, useState } from "react";

type Track = {
  id: number;
  title: string;
  type: string;
  release_id: number;
  created: string;
  changed: string;
};

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/tracks")
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Tracks</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.title} (release: {track.title}, released: {track.created})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
