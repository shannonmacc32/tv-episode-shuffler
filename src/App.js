import React, { useState, useEffect } from 'react';

function App() {
  const [episodes, setEpisodes] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [categoryToShuffle, setCategoryToShuffle] = useState('all');
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    show: '',
    platform: '',
    link: '',
    category: 'funny'
  });

  // Load episodes from localStorage
  useEffect(() => {
    const storedEpisodes = JSON.parse(localStorage.getItem('episodes'));
    if (storedEpisodes) setEpisodes(storedEpisodes);
  }, []);

  // Save episodes to localStorage
  useEffect(() => {
    localStorage.setItem('episodes', JSON.stringify(episodes));
  }, [episodes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEpisode((prev) => ({ ...prev, [name]: value }));
  };

  const addEpisode = () => {
    const { title, show, platform, link, category } = newEpisode;
    if (title && show && platform && link && category) {
      setEpisodes([...episodes, newEpisode]);
      setNewEpisode({ title: '', show: '', platform: '', link: '', category: 'funny' });
    } else {
      alert("Please fill out all fields");
    }
  };

  const deleteEpisode = (indexToDelete) => {
    const updated = episodes.filter((_, index) => index !== indexToDelete);
    setEpisodes(updated);
    setShuffled([]);
  };

  const shuffleEpisodes = () => {
    const filtered =
      categoryToShuffle === 'all'
        ? episodes
        : episodes.filter((ep) => ep.category === categoryToShuffle);
    const shuffledList = [...filtered].sort(() => Math.random() - 0.5);
    setShuffled(shuffledList);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>🎲 Shuffle My Episodes</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Add a Favorite Episode</h2>
        <input name="title" placeholder="Episode Title" value={newEpisode.title} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        <input name="show" placeholder="TV Show" value={newEpisode.show} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        <input name="platform" placeholder="Streaming Platform" value={newEpisode.platform} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        <input name="link" placeholder="Watch Link" value={newEpisode.link} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
        <select name="category" value={newEpisode.category} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}>
          <option value="funny">🎭 Funny</option>
          <option value="sad">😢 Sad</option>
          <option value="comfort">💆‍♀️ Comfort</option>
          <option value="random">🎲 Random</option>
        </select>
        <button onClick={addEpisode} style={{ padding: '0.5rem 1rem' }}>➕ Add Episode</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Choose category to shuffle:</strong></label>
        <select value={categoryToShuffle} onChange={(e) => setCategoryToShuffle(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
          <option value="all">🌐 All Categories</option>
          <option value="funny">🎭 Funny</option>
          <option value="sad">😢 Sad</option>
          <option value="comfort">💆‍♀️ Comfort</option>
          <option value="random">🎲 Random</option>
        </select>
      </div>

      <button onClick={shuffleEpisodes} style={{ padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
        🔀 Shuffle Episodes
      </button>

      {shuffled.length > 0 && <h3>🎬 Your Shuffled Lineup</h3>}
      {shuffled.map((ep, idx) => (
        <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>{ep.title}</h2>
          <p><strong>Show:</strong> {ep.show}</p>
          <p><strong>Platform:</strong> {ep.platform}</p>
          <p><strong>Category:</strong> {ep.category}</p>
          <a href={ep.link} target="_blank" rel="noopener noreferrer">▶️ Watch Now</a>
        </div>
      ))}

      <hr style={{ margin: '2rem 0' }} />
      <h2>Your Episode List</h2>
      {episodes.length === 0 && <p>No episodes added yet.</p>}
      {episodes.map((ep, idx) => (
        <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px dashed #888', borderRadius: '8px' }}>
          <h3>{ep.title}</h3>
          <p><strong>Show:</strong> {ep.show}</p>
          <p><strong>Platform:</strong> {ep.platform}</p>
          <p><strong>Category:</strong> {ep.category}</p>
          <button onClick={() => deleteEpisode(idx)} style={{ marginTop: '0.5rem', color: 'red' }}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
