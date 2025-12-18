document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const urgentCheckbox = document.getElementById('urgent-checkbox');
  const importantCheckbox = document.getElementById('important-checkbox');
  const reminderInput = document.getElementById('reminder-input');
  
  let todos = [];
  let reminderCheckInterval = null;

  // Request notification permission on load
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Load todos from localStorage
  function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
      todos = JSON.parse(stored);
      todos.forEach(todo => renderTodo(todo));
    }
  }

  // Save todos to localStorage
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // Check for due reminders
  function checkReminders() {
    const now = new Date().getTime();
    todos.forEach(todo => {
      if (todo.reminder && !todo.reminderShown && new Date(todo.reminder).getTime() <= now) {
        showNotification(todo);
        todo.reminderShown = true;
        saveTodos();
      }
    });
  }

  // Show notification
  function showNotification(todo) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('To-Do Reminder', {
        body: todo.text,
        tag: todo.id
      });
    } else {
      alert(`Reminder: ${todo.text}`);
    }
  }

  // Start reminder check interval
  function startReminderCheck() {
    if (!reminderCheckInterval) {
      reminderCheckInterval = setInterval(checkReminders, 10000); // Check every 10 seconds
    }
  }

  // Format reminder display
  function formatReminder(reminderDate) {
    const date = new Date(reminderDate);
    const now = new Date();
    const diff = date - now;
    
    if (diff < 0) return '⏰ Past due';
    if (diff < 60000) return '⏰ Due now';
    if (diff < 3600000) return `⏰ ${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `⏰ ${Math.floor(diff / 3600000)}h`;
    
    return `⏰ ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }

  function getQuadrant(isUrgent, isImportant) {
    if (isUrgent && isImportant) {
      return 'urgent-important';
    } else if (!isUrgent && isImportant) {
      return 'not-urgent-important';
    } else if (isUrgent && !isImportant) {
      return 'urgent-not-important';
    } else {
      return 'not-urgent-not-important';
    }
  }

  function createItem(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.completed) {
      li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    
    // Add reminder indicator if present
    if (todo.reminder) {
      const reminderSpan = document.createElement('span');
      reminderSpan.className = 'reminder-indicator';
      reminderSpan.textContent = formatReminder(todo.reminder);
      span.appendChild(reminderSpan);
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'reminder-actions';

    // Edit reminder button
    if (todo.reminder) {
      const editReminderBtn = document.createElement('button');
      editReminderBtn.className = 'edit-reminder-btn';
      editReminderBtn.type = 'button';
      editReminderBtn.setAttribute('aria-label', 'Edit or clear reminder');
      editReminderBtn.textContent = '🔔';
      
      editReminderBtn.addEventListener('click', () => {
        editReminder(todo);
      });
      
      actionsDiv.appendChild(editReminderBtn);
    }

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.type = 'button';
    completeBtn.setAttribute('aria-label', todo.completed ? 'Mark as incomplete' : 'Mark as complete');
    completeBtn.textContent = '👍';

    completeBtn.addEventListener('click', () => {
      todo.completed = !todo.completed;
      li.classList.toggle('completed');
      completeBtn.setAttribute('aria-label', todo.completed ? 'Mark as incomplete' : 'Mark as complete');
      saveTodos();
      input.focus();
    });

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete to-do');
    del.textContent = 'Delete';

    del.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      li.remove();
      input.focus();
    });

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(del);

    li.appendChild(span);
    li.appendChild(actionsDiv);
    return li;
  }

  function renderTodo(todo) {
    const quadrant = getQuadrant(todo.urgent, todo.important);
    const quadrantList = document.querySelector(`[data-quadrant="${quadrant}"]`);
    
    if (quadrantList) {
      quadrantList.appendChild(createItem(todo));
    } else {
      console.error(`Quadrant element not found: ${quadrant}`);
    }
  }

  function editReminder(todo) {
    const newReminder = prompt('Edit reminder (leave empty to clear):\nFormat: YYYY-MM-DDTHH:MM', todo.reminder || '');
    
    if (newReminder === null) return; // User cancelled
    
    if (newReminder === '') {
      // Clear reminder
      todo.reminder = null;
      todo.reminderShown = false;
    } else {
      // Validate and set reminder
      const reminderDate = new Date(newReminder);
      if (isNaN(reminderDate.getTime())) {
        alert('Invalid date format');
        return;
      }
      todo.reminder = newReminder;
      todo.reminderShown = false;
    }
    
    saveTodos();
    
    // Re-render the todo
    const quadrant = getQuadrant(todo.urgent, todo.important);
    const quadrantList = document.querySelector(`[data-quadrant="${quadrant}"]`);
    const existingLi = quadrantList.querySelector(`[data-id="${todo.id}"]`);
    if (existingLi) {
      const newLi = createItem(todo);
      existingLi.replaceWith(newLi);
    }
  }

  function addTodo(text, isUrgent, isImportant, reminder = null) {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    const todo = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      text: trimmed,
      urgent: isUrgent,
      important: isImportant,
      completed: false,
      reminder: reminder,
      reminderShown: false
    };
    
    todos.push(todo);
    saveTodos();
    renderTodo(todo);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isUrgent = urgentCheckbox.checked;
    const isImportant = importantCheckbox.checked;
    const reminder = reminderInput.value || null;
    
    addTodo(input.value, isUrgent, isImportant, reminder);
    
    input.value = '';
    urgentCheckbox.checked = false;
    importantCheckbox.checked = false;
    reminderInput.value = '';
    input.focus();
  });

  // Initialize
  loadTodos();
  startReminderCheck();
  checkReminders(); // Check immediately on load
});
