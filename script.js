document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const urgentCheckbox = document.getElementById('urgent-checkbox');
  const importantCheckbox = document.getElementById('important-checkbox');

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

  function createItem(text) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete to-do');
    del.textContent = 'Delete';

    del.addEventListener('click', () => {
      li.remove();
      input.focus();
    });

    li.appendChild(span);
    li.appendChild(del);
    return li;
  }

  function addTodo(text, isUrgent, isImportant) {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    const quadrant = getQuadrant(isUrgent, isImportant);
    const quadrantList = document.querySelector(`[data-quadrant="${quadrant}"]`);
    
    if (quadrantList) {
      quadrantList.appendChild(createItem(trimmed));
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isUrgent = urgentCheckbox.checked;
    const isImportant = importantCheckbox.checked;
    
    addTodo(input.value, isUrgent, isImportant);
    
    input.value = '';
    urgentCheckbox.checked = false;
    importantCheckbox.checked = false;
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Handled by form submit, but keep for clarity in some browsers
    }
  });
});
