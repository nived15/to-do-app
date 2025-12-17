document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  function createItem(text) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text;

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.type = 'button';
    completeBtn.setAttribute('aria-label', 'Mark as complete');
    completeBtn.textContent = '👍';

    completeBtn.addEventListener('click', () => {
      li.classList.toggle('completed');
      const isCompleted = li.classList.contains('completed');
      completeBtn.setAttribute('aria-label', isCompleted ? 'Mark as incomplete' : 'Mark as complete');
      input.focus();
    });

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
    li.appendChild(completeBtn);
    li.appendChild(del);
    return li;
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    list.appendChild(createItem(trimmed));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Handled by form submit, but keep for clarity in some browsers
    }
  });
});
