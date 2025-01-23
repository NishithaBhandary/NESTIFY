let notes = []; // Array to store notes
let selectedColor = '#FFE2E2'; // Default color
let currentEditingNote = null;

// Load notes when the page loads
window.onload = () => {
    loadNotes();
    setupColorPicker();
    // Add search functionality
    document.getElementById('search-notes').addEventListener('input', searchNotes);
};

// Function to load notes from localStorage
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    renderNotes();
}

// Function to save notes to localStorage
function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to setup color picker
function setupColorPicker() {
    const colorOptions = document.querySelectorAll('.color-choices .color-option');
    
    // Set default selected color
    colorOptions[0].classList.add('selected');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            option.classList.add('selected');
            // Update selected color
            selectedColor = option.dataset.color;
        });
    });
}

// Function to save a new note
function saveNote() {
    const noteHeading = document.getElementById('note-heading').value;
    const noteContent = document.getElementById('note-content').value;

    if (noteHeading.trim() && noteContent.trim()) {
        const newNote = {
            id: Date.now(),
            heading: noteHeading.trim(),
            content: noteContent.trim(),
            color: selectedColor,
            createdAt: new Date().toISOString()
        };

        notes.push(newNote);
        saveNotesToStorage();

        // Clear inputs
        document.getElementById('note-heading').value = '';
        document.getElementById('note-content').value = '';
        
        // Reset color selection
        const colorOptions = document.querySelectorAll('.color-choices .color-option');
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        colorOptions[0].classList.add('selected');
        selectedColor = colorOptions[0].dataset.color;

        renderNotes();
    } else {
        alert('Please provide both a heading and content for the note.');
    }
}

// Function to delete a note
function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== noteId);
        saveNotesToStorage();
        renderNotes();
        closeNoteDialog(); // Close dialog if open
    }
}

// Function to search notes
function searchNotes(e) {
    const searchTerm = e.target.value.toLowerCase();
    const noteElements = document.querySelectorAll('.note-box');
    
    noteElements.forEach(noteElement => {
        const heading = noteElement.querySelector('h3').textContent.toLowerCase();
        const content = noteElement.querySelector('p').textContent.toLowerCase();
        
        if (heading.includes(searchTerm) || content.includes(searchTerm)) {
            noteElement.style.display = 'block';
        } else {
            noteElement.style.display = 'none';
        }
    });
}

// Function to open note dialog
function openNoteDialog(note) {
    const dialog = document.getElementById('note-dialog-overlay');
    
    // Store current note for editing
    currentEditingNote = note;
    
    // Update content
    updateDialogContent(note);

    // Show dialog with animation
    dialog.style.display = 'flex';
    dialog.style.backgroundColor = note.color + '99'; // 60% opacity
    
    // Add event listener to close dialog when clicking outside
    dialog.onclick = (e) => {
        if (e.target === dialog) {
            closeNoteDialog();
        }
    };

    // Prevent scrolling on the body while dialog is open
    document.body.style.overflow = 'hidden';
}

// Function to close note dialog
function closeNoteDialog() {
    const dialog = document.getElementById('note-dialog-overlay');
    dialog.style.display = 'none';
    
    // Reset current editing note
    currentEditingNote = null;
    
    // Ensure we exit edit mode
    const editElements = document.querySelectorAll('.edit-mode');
    const viewElements = document.querySelectorAll('.view-mode');
    
    editElements.forEach(el => el.classList.add('hidden'));
    viewElements.forEach(el => el.classList.remove('hidden'));
    
    // Restore body scrolling
    document.body.style.overflow = '';
}

// Function to toggle edit mode in dialog
function toggleEditMode() {
    const viewElements = document.querySelectorAll('.view-mode');
    const editElements = document.querySelectorAll('.edit-mode');
    const titleInput = document.getElementById('dialog-note-title-edit');
    const contentInput = document.getElementById('dialog-note-content-edit');

    // Toggle visibility
    viewElements.forEach(el => el.classList.toggle('hidden'));
    editElements.forEach(el => el.classList.toggle('hidden'));

    // If entering edit mode
    if (!editElements[0].classList.contains('hidden')) {
        titleInput.value = currentEditingNote.heading;
        contentInput.value = currentEditingNote.content;
        
        // Select current color
        const colorOptions = document.querySelectorAll('.note-dialog .color-option');
        colorOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === currentEditingNote.color) {
                option.classList.add('selected');
            }
        });

        // Focus on title
        titleInput.focus();
        
        // Setup color picker
        setupDialogColorPicker();
    }
}

// Function to setup color picker in dialog
function setupDialogColorPicker() {
    const colorOptions = document.querySelectorAll('.note-dialog .color-option');
    colorOptions.forEach(option => {
        option.onclick = () => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        };
    });
}

// Function to save edited note
function saveNoteEdit() {
    const titleInput = document.getElementById('dialog-note-title-edit');
    const contentInput = document.getElementById('dialog-note-content-edit');
    const selectedColor = document.querySelector('.note-dialog .color-option.selected');

    if (titleInput.value.trim() && contentInput.value.trim()) {
        // Update note in array
        const noteIndex = notes.findIndex(note => note.id === currentEditingNote.id);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...currentEditingNote,
                heading: titleInput.value.trim(),
                content: contentInput.value.trim(),
                color: selectedColor ? selectedColor.dataset.color : currentEditingNote.color,
                updatedAt: new Date().toISOString()
            };

            // Save to localStorage
            saveNotesToStorage();

            // Update view
            renderNotes();

            // Update dialog content and exit edit mode
            currentEditingNote = notes[noteIndex];
            updateDialogContent(currentEditingNote);
            toggleEditMode();
        }
    } else {
        alert('Please provide both a title and content for the note.');
    }
}

// Function to update dialog content
function updateDialogContent(note) {
    const title = document.getElementById('dialog-note-title');
    const content = document.getElementById('dialog-note-content');
    const date = document.getElementById('dialog-note-date');

    title.textContent = note.heading;
    content.textContent = note.content;
    
    const noteDate = new Date(note.createdAt);
    const updatedDate = note.updatedAt ? new Date(note.updatedAt) : null;
    
    const formattedDate = noteDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = noteDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    let dateText = `Created on ${formattedDate} at ${formattedTime}`;
    
    if (updatedDate) {
        const formattedUpdateDate = updatedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        const formattedUpdateTime = updatedDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        dateText += `\nLast edited on ${formattedUpdateDate} at ${formattedUpdateTime}`;
    }
    
    date.textContent = dateText;
}

// Function to render the notes dynamically
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    const noNotesMessage = document.getElementById('no-notes-message');

    // Clear the current notes
    notesList.innerHTML = '';

    // If there are no notes, show the "No notes yet" message
    if (notes.length === 0) {
        noNotesMessage.style.display = 'flex';
    } else {
        noNotesMessage.style.display = 'none';

        // Sort notes by creation date (newest first)
        const sortedNotes = [...notes].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Loop through the notes array and display each note
        sortedNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-box');
            noteElement.style.backgroundColor = note.color;

            const noteHeader = document.createElement('div');
            noteHeader.className = 'note-header';

            const noteHeading = document.createElement('h3');
            noteHeading.textContent = note.heading;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-note-btn';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteNote(note.id);
            };

            const noteContent = document.createElement('p');
            noteContent.className = 'note-content';
            noteContent.textContent = note.content;

            const noteDate = document.createElement('div');
            noteDate.className = 'note-date';
            noteDate.textContent = new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const expandButton = document.createElement('button');
            expandButton.className = 'expand-note-btn';
            expandButton.innerHTML = '<i class="fas fa-expand-alt"></i>';
            expandButton.onclick = (e) => {
                e.stopPropagation();
                openNoteDialog(note);
            };

            noteHeader.appendChild(noteHeading);
            noteHeader.appendChild(deleteButton);
            
            noteElement.appendChild(noteHeader);
            noteElement.appendChild(noteContent);
            noteElement.appendChild(noteDate);
            noteElement.appendChild(expandButton);

            // Make the entire note clickable
            noteElement.onclick = () => openNoteDialog(note);

            // Append the note element to the notes list
            notesList.appendChild(noteElement);
        });
    }
}
