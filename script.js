document.addEventListener('DOMContentLoaded', () => {
    const noteTitleInput = document.getElementById('note-title');
    const noteTextInput = document.getElementById('note-text');
    const addNoteBtn = document.getElementById('add-note');
    const notesList = document.getElementById('notes-list');
    const notesCountSpan = document.getElementById('notes-count');
    const searchInput = document.getElementById('search-input');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const noNotesMessage = document.querySelector('.no-notes');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let editingIndex = -1; // -1 means no note is being edited

    // Function to render notes
    function renderNotes(filter = '') {
        notesList.innerHTML = ''; // Clear current list
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(filter.toLowerCase()) ||
            note.text.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredNotes.length === 0 && !filter) {
            noNotesMessage.style.display = 'flex';
        } else {
            noNotesMessage.style.display = 'none';
            filteredNotes.forEach((note, index) => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-item');
                noteElement.dataset.index = notes.indexOf(note); // Store original index

                noteElement.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.text}</p>
                `;

                noteElement.addEventListener('click', () => {
                    selectNoteForEditing(notes.indexOf(note));
                });

                notesList.appendChild(noteElement);
            });
        }
        notesCountSpan.textContent = notes.length;
    }

    // Function to save notes to local storage
    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes(searchInput.value); // Re-render after saving
    }

    // Function to select a note for editing
    function selectNoteForEditing(index) {
        editingIndex = index;
        noteTitleInput.value = notes[index].title;
        noteTextInput.value = notes[index].text;
        addNoteBtn.textContent = 'Save Edit'; // Change button text

        // Highlight the selected note
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.note-item[data-index="${index}"]`).classList.add('selected');
    }

    // Function to clear input fields and reset state
    function clearInputAndReset() {
        noteTitleInput.value = '';
        noteTextInput.value = '';
        addNoteBtn.textContent = 'Add Note';
        editingIndex = -1;
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('selected');
        });
    }

    // Add/Save Note button event listener
    addNoteBtn.addEventListener('click', () => {
        const title = noteTitleInput.value.trim();
        const text = noteTextInput.value.trim();

        if (title || text) { // Allow saving notes with only title or only text
            if (editingIndex !== -1) {
                // Save edited note
                notes[editingIndex] = { title, text };
            } else {
                // Add new note
                notes.push({ title, text });
            }
            saveNotes();
            clearInputAndReset();
        } else if (editingIndex !== -1) {
            // If editing and both fields are empty, treat as delete
            notes.splice(editingIndex, 1);
            saveNotes();
            clearInputAndReset();
        }
    });

    // Implement Delete functionality (can add a separate button or context menu later if needed)
    // For now, deleting is handled by clearing fields while editing and clicking "Save Edit"

    // Search input event listener
    searchInput.addEventListener('input', (e) => {
        renderNotes(e.target.value);
    });

    // Dark mode toggle event listener
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Save dark mode preference to local storage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Check for saved dark mode preference on load
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // Initial render
    renderNotes();
});
