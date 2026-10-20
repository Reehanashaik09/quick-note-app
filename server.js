const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'notes.json');

app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname)));

// Helper function to read notes
const readNotes = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper function to write notes
const writeNotes = (notes) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
};

// GET: Fetch all notes
app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

// POST: Add a new note
app.post('/api/notes', (req, res) => {
    const notes = readNotes();
    const newNote = {
        id: Date.now().toString(),
        title: req.body.title || 'Untitled',
        content: req.body.content || ''
    };
    notes.push(newNote);
    writeNotes(notes);
    res.status(201).json(newNote);
});

// DELETE: Remove a note by ID
app.delete('/api/notes/:id', (req, res) => {
    let notes = readNotes();
    const filteredNotes = notes.filter(note => note.id !== req.params.id);
    if (notes.length === filteredNotes.length) {
        return res.status(404).json({ error: 'Note not found' });
    }
    writeNotes(filteredNotes);
    res.json({ message: 'Note deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});