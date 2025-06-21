const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Get all slides
app.get('/api/slides', (req, res) => {
  db.all('SELECT * FROM slides ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get a single slide by ID
app.get('/api/slides/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM slides WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Slide not found' });
    res.json(row);
  });
});

// Create a new slide
app.post('/api/slides', (req, res) => {
  const { title, content } = req.body;
  db.run(
    'INSERT INTO slides (title, content) VALUES (?, ?)',
    [title, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update an existing slide
app.put('/api/slides/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.run(
    'UPDATE slides SET title = ?, content = ? WHERE id = ?',
    [title, content, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: 'Slide not found' });
      res.json({ message: 'Slide updated successfully' });
    }
  );
});

// Delete a slide
app.delete('/api/slides/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM slides WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: 'Slide not found' });
    res.json({ message: 'Slide deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});