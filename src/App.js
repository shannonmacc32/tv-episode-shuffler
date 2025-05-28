import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [playlists, setPlaylists] = useState({});
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [newEpisode, setNewEpisode] = useState("");
  const [shuffledEpisode, setShuffledEpisode] = useState(null);
  const [renameMap, setRenameMap] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playlists"));
    if (saved) setPlaylists(saved);
  }, []);

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
    <div className="App">
      <h1>TV Episode Shuffler</h1>

      <div>
        <input
          type="text"
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button onClick={addPlaylist}>Add Playlist</button>
      </div>

      <div>
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          <option value="">Select a playlist</option>
          {Object.keys(playlists).map((pl) => (
            <option key={pl} value={pl}>{pl}</option>
          ))}
        </select>
      </div>

      {selectedPlaylist && (
        <>
          <input
            type="text"
            placeholder="Episode name (e.g., Friends S1E1)"
            value={newEpisode}
            onChange={(e) => setNewEpisode(e.target.value)}
          />
          <button onClick={addEpisode}>Add Episode</button>
        </>
      )}

      <div>
        <button onClick={shuffleEpisode} disabled={!selectedPlaylist}>
          Shuffle from {selectedPlaylist || "..."}
        </button>
        {shuffledEpisode && <p>🎲 {shuffledEpisode}</p>}
      </div>

      <div>
        <h3>Your Playlists</h3>
        {Object.entries(playlists).map(([name, eps]) => (
          <div key={name} style={{ marginBottom: "10px" }}>
            <strong>{name}</strong>: {eps.join(", ") || "(No episodes yet)"}
            <br />
            <input
              type="text"
              placeholder="New name"
              onChange={(e) => setRenameMap({ ...renameMap, [name]: e.target.value })}
            />
            <button onClick={() => handleRename(name)}>Rename</button>
            <button onClick={() => handleDelete(name)} style={{ color: "red", marginLeft: "8px" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;