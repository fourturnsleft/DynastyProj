const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const SLEEPER_BASE = 'https://api.sleeper.app/v1';

// Get all NFL players (dynasty-relevant)
app.get('/api/players', async (req, res) => {
  try {
    const response = await axios.get(`${SLEEPER_BASE}/players/nfl`);
    const all = response.data;

    // Filter to skill positions only
    const positions = ['QB', 'RB', 'WR', 'TE'];
    const players = Object.entries(all)
      .filter(([, p]) => positions.includes(p.position) && p.active && p.full_name)
      .map(([id, p]) => ({
        id,
        name: p.full_name,
        position: p.position,
        team: p.team || 'FA',
        age: p.age,
        years_exp: p.years_exp,
        espn_id: p.espn_id || null,
      }));

    res.json(players);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Get dynasty ADP/rankings from Sleeper
app.get('/api/rankings', async (req, res) => {
  try {
    const response = await axios.get(`${SLEEPER_BASE}/players/nfl/trending/add?lookback_hours=168&limit=200`);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
