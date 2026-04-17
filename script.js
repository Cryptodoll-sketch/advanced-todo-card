// Function to calculate and display time remaining for each todo item
function updateTimeRemaining() {
    const timeElements = document.querySelectorAll('.time');

    timeElements.forEach(timeEl => {
        const article = timeEl.closest('article');
        const dueDateEl = article.querySelector('[data-testid="test-todo-due-date"]');
        const dueDateStr = dueDateEl.getAttribute('datetime');
        const dueDate = new Date(dueDateStr);
        const now = new Date();
        const diffMs = dueDate - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        let timeText = '';
        if (diffMs > 0) {
            if (diffDays > 0) {
                timeText = `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
            } else if (diffHours > 0) {
                timeText = `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
            } else if (diffMinutes > 0) {
                timeText = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
            } else {
                timeText = 'Due soon';
            }
        } else {
            const overdueMs = -diffMs;
            const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
            const overdueHours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (overdueDays > 0) {
                timeText = `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
            } else if (overdueHours > 0) {
                timeText = `Overdue by ${overdueHours} hour${overdueHours > 1 ? 's' : ''}`;
            } else {
                timeText = 'Overdue';
            }
        }

        timeEl.textContent = timeText;
    });
}

// Update time remaining on page load
updateTimeRemaining();

// Update every minute
setInterval(updateTimeRemaining, 60000);

// Add event listeners for checkboxes
document.querySelectorAll('[data-testid="test-todo-complete-toggle"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const article = this.closest('article');
        const statusEl = article.querySelector('[data-testid="test-todo-status"]');
        if (this.checked) {
            article.classList.add('done');
            statusEl.textContent = 'Done';
        } else {
            article.classList.remove('done');
            statusEl.textContent = 'Pending';
        }
    });
});

// Add event listeners for edit buttons
document.querySelectorAll('[data-testid="test-todo-edit-button"]').forEach(button => {
    button.addEventListener('click', function() {
        const article = this.closest('article');
        const titleEl = article.querySelector('[data-testid="test-todo-title"]');
        const descEl = article.querySelector('[data-testid="test-todo-description"]');
        const actionsDiv = article.querySelector('.actions');

        // If already in edit mode, do nothing or handle save
        if (article.classList.contains('editing')) return;

        // Enter edit mode
        article.classList.add('editing');

        // Replace title with input
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = titleEl.textContent;
        titleInput.className = 'edit-input';
        titleInput.setAttribute('data-testid', 'test-todo-title');
        titleEl.replaceWith(titleInput);

        // Replace description with textarea
        const descTextarea = document.createElement('textarea');
        descTextarea.value = descEl.textContent;
        descTextarea.className = 'edit-textarea';
        descTextarea.setAttribute('data-testid', 'test-todo-description');
        descEl.replaceWith(descTextarea);

        // Replace actions with save and cancel
        const originalActions = actionsDiv.innerHTML;
        actionsDiv.innerHTML = `
            <button data-testid="test-todo-save-button" aria-label="Save changes"><i class="ri-check-line"></i></button>
            <button data-testid="test-todo-cancel-button" aria-label="Cancel editing"><i class="ri-close-line"></i></button>
        `;

        // Add event listeners for save and cancel
        const saveBtn = actionsDiv.querySelector('[data-testid="test-todo-save-button"]');
        const cancelBtn = actionsDiv.querySelector('[data-testid="test-todo-cancel-button"]');

        saveBtn.addEventListener('click', function() {
            // Save changes
            const newTitle = titleInput.value.trim();
            const newDesc = descTextarea.value.trim();

            if (newTitle) {
                const newTitleEl = document.createElement('h3');
                newTitleEl.textContent = newTitle;
                newTitleEl.setAttribute('data-testid', 'test-todo-title');
                titleInput.replaceWith(newTitleEl);
            } else {
                titleInput.replaceWith(titleEl); // Restore original if empty
            }

            const newDescEl = document.createElement('p');
            newDescEl.textContent = newDesc;
            newDescEl.setAttribute('data-testid', 'test-todo-description');
            descTextarea.replaceWith(newDescEl);

            // Restore actions
            actionsDiv.innerHTML = originalActions;
            article.classList.remove('editing');
        });

        cancelBtn.addEventListener('click', function() {
            // Cancel editing
            titleInput.replaceWith(titleEl);
            descTextarea.replaceWith(descEl);
            actionsDiv.innerHTML = originalActions;
            article.classList.remove('editing');
        });
    });
});

// Add event listeners for delete buttons
document.querySelectorAll('[data-testid="test-todo-delete-button"]').forEach(button => {
    button.addEventListener('click', function() {
        const article = this.closest('article');
        if (confirm("Are you sure you want to delete this task?")) {
            article.remove();
        }
    });
});