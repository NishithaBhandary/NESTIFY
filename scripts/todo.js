// Load tasks when page loads
window.onload = () => {
    loadTasks();
    // Add event listener for the add task button
    document.querySelector('#add-task-button').addEventListener('click', addTask);
};

let tasks = [];

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const dateInput = document.getElementById('due-date');
    const timeInput = document.getElementById('due-time');
    
    if (taskInput.value.trim() === '') {
        alert('Please enter a task');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        completed: false,
        dueDate: dateInput.value,
        dueTime: timeInput.value,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    // Clear inputs
    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const dueDate = document.createElement('span');
        dueDate.className = 'task-due';
        if (task.dueDate) {
            const date = new Date(task.dueDate + 'T' + (task.dueTime || '00:00'));
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            let dateText = `<i class="fas fa-clock"></i> ${formattedDate}`;
            if (task.dueTime) {
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
                dateText += ` at ${formattedTime}`;
            }
            dueDate.innerHTML = dateText;
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(dueDate);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}