const API_URL = '/api/notes';

// DOM Elements
const noteForm = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const notesContainer = document.getElementById('notes-container');

// Fetch all notes from backend
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

// Render notes to the DOM
function renderNotes(notes) {
    notesContainer.innerHTML = '';
    if (notes.length === 0) {
        notesContainer.innerHTML = '<p style="text-align: center; color: #777;">No notes yet. Add one above!</p>';
        return;
    }

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.innerHTML = `
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content)}</p>
            <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// Add a new note
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title && !content) return;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        noteTitleInput.value = '';
        noteContentInput.value = '';
        fetchNotes();
    } catch (error) {
        console.error('Error adding note:', error);
    }
});

// Delete a note
async function deleteNote(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

// Helper to prevent HTML injection
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initial fetch
fetchNotes();