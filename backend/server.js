const express = require('express');  
const connection = require('./db'); 
const cors = require('cors') 
const app = express();  
app.use(express.json());  
app.use(cors())

const PORT = 8080;

app.use(cors());
app.use(express.json());


app.get('/movies', (req, res) => {  
  connection.query('SELECT * FROM movies', (err, results) => {  
    if (err) {
      console.error('Error fetching movies from database:', err);
      return res.status(500).json({ error: 'Database error' });  
    }  
    res.json({ movies: results });  
  });  
}); 


app.post('/movies', (req, res) => {  
  const { title, director, genre, release_year, rating } = req.body;  
  if (!title || !director || !genre || !release_year ||!rating) {  
    return res.status(400).json({ error: 'Missing required fields' });  
  }  
  connection.query(  
    'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)',  
    [title, director, genre, release_year, rating],  
    (err, results) => {  
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Movie created', id: results.insertId });  
    }  
  );  
}); 

app.put('/movies/:id', (req, res) => {  
  const { title } = req.body;  
  const id = req.params.id;  
  if (!title) return res.status(400).json({ error: 'Missing' });  
  connection.query(  
    'UPDATE movies SET title = ? WHERE id = ?',  
    [title, id],  
    (err, results) => {  
      if (err) return res.status(500).json({ error: 'Database error' });  
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Movie not found' });  
      res.json({ message: 'Movie updated' });  
    }  
  );  
});  
 
app.delete('/movies/:id', (req, res) => {  
  const id = req.params.id;  
  connection.query('DELETE FROM movies WHERE id = ?', [id], (err, results) => {  
    if (err) return res.status(500).json({ error: 'Database error' });  
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Movie not found' });  
    res.json({ message: 'Movie deleted' });  
  });  
});  


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});