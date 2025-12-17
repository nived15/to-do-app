# Simple To‑Do App with Eisenhower Matrix

A minimal, client‑side to‑do list built with HTML, CSS, and JavaScript. Organize your tasks using the Eisenhower Matrix to prioritize what matters most.

## Quick Start

- Open [index.html](index.html) directly in your browser, or run a small static server:

```bash
# Python 3
python -m http.server 5500

# Or with Node (if installed)
npx serve -l 5500
```

Then navigate to http://localhost:5500

## Features

- **Eisenhower Matrix Organization**: Categorize tasks into four quadrants based on urgency and importance
  - **Urgent & Important** (Do First) - Critical tasks requiring immediate attention
  - **Not Urgent & Important** (Schedule) - Important tasks to plan and schedule
  - **Urgent & Not Important** (Delegate) - Tasks that need quick action but could be delegated
  - **Not Urgent & Not Important** (Eliminate) - Low-priority tasks to consider removing
- **Priority Selection**: Check "Urgent" and/or "Important" boxes when adding tasks
- **Visual Quadrants**: Color-coded quadrants (red, green, yellow, gray) for easy recognition
- **Dynamic List Rendering**: Tasks automatically appear in the correct quadrant
- **Delete Functionality**: Remove tasks with a Delete button per item
- **Keyboard Friendly**: Press Enter to add tasks quickly
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Type your task in the input field
2. Select priority by checking "Urgent" and/or "Important" boxes:
   - Both checked → Urgent & Important (red quadrant)
   - Only Important → Not Urgent & Important (green quadrant)
   - Only Urgent → Urgent & Not Important (yellow quadrant)
   - Neither checked → Not Urgent & Not Important (gray quadrant)
3. Press Enter or click "Add" to create the task
4. Tasks appear in their respective quadrants
5. Click "Delete" to remove a task

## Files

- [index.html](index.html) – markup and structure with Eisenhower Matrix layout
- [styles.css](styles.css) – styling for quadrants and responsive design
- [script.js](script.js) – task categorization and management logic