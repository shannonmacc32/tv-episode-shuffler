import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [playlists, setPlaylists] = useState({});
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [newEpisode, setNewEpisode] = useState("");
  const [shuffledEpisode, setShuffledEpisode] = useState(null);
  const [renameMap, setRenameMap] = useState({});

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playlists"));
    if (saved) setPlaylists(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  const addPlaylist = () => {
    if (!newPlaylistName || playlists[newPlaylistName]) return;
    setPlaylists({ ...playlists, [newPlaylistName]: [] });
    setNewPlaylistName("");
  };

  const addEpisode = () => {
    if (!selectedPlaylist || !newEpisode) return;
    const updated = {
      ...playlists,
      [selectedPlaylist]: [...playlists[selectedPlaylist], newEpisode],
    };
    setPlaylists(updated);
    setNewEpisode("");
  };

  const shuffleEpisode = () => {
    if (!selectedPlaylist || playlists[selectedPlaylist].length === 0) return;
    const eps = playlists[selectedPlaylist];
    const random = eps[Math.floor(Math.random() * eps.length)];
    setShuffledEpisode(random);
  };

  const handleDelete = (playlistName) => {
    const updated = { ...playlists };
    delete updated[playlistName];
    setPlaylists(updated);
    if (selectedPlaylist === playlistName) setSelectedPlaylist("");
  };

  const handleRename = (oldName) => {
    const newName = renameMap[oldName];
    if (!newName || playlists[newName]) return;

    const updated = { ...playlists };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setPlaylists(updated);

    if (selectedPlaylist === oldName) setSelectedPlaylist(newName);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>TV Episode Shuffler</h1>

      <input
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        placeholder="New playlist name"
      />
      <button onClick={addPlaylist}>Add Playlist</button>

      <br /><br />

      <select
        value={selectedPlaylist}
        onChange={(e) => setSelectedPlaylist(e.target.value)}
      >
        <option value="">Select a playlist</option>
        {Object.keys(playlists).map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <br /><br />

      {selectedPlaylist && (
        <>
          <input
            value={newEpisode}
            onChange={(e) => setNewEpisode(e.target.value)}
            placeholder="Add episode (e.g., Friends S1E1)"
          />
          <button onClick={addEpisode}>Add Episode</button>
        </>
      )}

      <br /><br />

      <button onClick={shuffleEpisode} disabled={!selectedPlaylist}>
        Shuffle from {selectedPlaylist || "..."}
      </button>

      {shuffledEpisode && (
        <p><strong>Watch:</strong> {shuffledEpisode}</p>
      )}

      <h2>Your Playlists</h2>
      {Object.entries(playlists).map(([name, eps]) => (
        <div key={name} style={{ marginBottom: "12px" }}>
          <strong>{name}</strong> ({eps.length} episodes)
          <br />
          <input
            placeholder="Rename to..."
            onChange={(e) =>
              setRenameMap({ ...renameMap, [name]: e.target.value })
            }
          />
          <button onClick={() => handleRename(name)}>Rename</button>
          <button onClick={() => handleDelete(name)} style={{ color: "red", marginLeft: "8px" }}>
            Delete
          </button>
          <div style={{ fontSize: "0.9em", marginTop: "4px" }}>
            {eps.join(", ") || "(No episodes yet)"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
