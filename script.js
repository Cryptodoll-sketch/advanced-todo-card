// BASE SETUP //

const cards = document.querySelectorAll('[data-testid="test-todo-card"]');


// STATUS SYNC //

function setStatus(card, value) {
  const checkbox = card.querySelector('[data-testid="test-todo-complete-toggle"]');
  const statusText = card.querySelector('[data-testid="test-todo-status"]');
  const statusControl = card.querySelector('[data-testid="test-todo-status-control"]');

  statusText.textContent = value;
  statusControl.value = value;

  if (value === "Done") {
    card.classList.add("done");
    checkbox.checked = true;
  } else {
    card.classList.remove("done");
    checkbox.checked = false;
  }
}

cards.forEach(card => {
  const checkbox = card.querySelector('[data-testid="test-todo-complete-toggle"]');
  const statusControl = card.querySelector('[data-testid="test-todo-status-control"]');

  checkbox.addEventListener("change", () => {
    setStatus(card, checkbox.checked ? "Done" : "Pending");
  });

  statusControl.addEventListener("change", () => {
    setStatus(card, statusControl.value);
  });
});


// EDIT MODE //

cards.forEach(card => {
  const editBtn = card.querySelector('[data-testid="test-todo-edit-button"]');
  const editForm = card.querySelector('[data-testid="test-todo-edit-form"]');
  const viewMode = card.querySelector('.view-mode');

  const titleEl = card.querySelector('[data-testid="test-todo-title"]');
  const descEl = card.querySelector('[data-testid="test-todo-description"]');
  const priorityEl = card.querySelector('[data-testid="test-todo-priority"]');
  const dueDateEl = card.querySelector('[data-testid="test-todo-due-date"]');

  const saveBtn = card.querySelector('[data-testid="test-todo-save-button"]');
  const cancelBtn = card.querySelector('[data-testid="test-todo-cancel-button"]');

  editBtn.addEventListener("click", () => {
    editForm.style.display = "flex";
    viewMode.style.display = "none";

    card.querySelector('[data-testid="test-todo-edit-title-input"]').value =
      titleEl.textContent;

    card.querySelector('[data-testid="test-todo-edit-description-input"]').value =
      descEl.textContent;

    card.querySelector('[data-testid="test-todo-edit-priority-select"]').value =
      priorityEl.textContent;

    card.querySelector('[data-testid="test-todo-edit-due-date-input"]').value =
      dueDateEl.getAttribute("datetime") || "";
  });

  saveBtn.addEventListener("click", () => {
    const newTitle = card.querySelector('[data-testid="test-todo-edit-title-input"]').value.trim();
    const newDesc = card.querySelector('[data-testid="test-todo-edit-description-input"]').value.trim();
    const newPriority = card.querySelector('[data-testid="test-todo-edit-priority-select"]').value;
    const newDate = card.querySelector('[data-testid="test-todo-edit-due-date-input"]').value;

    if (!newTitle) {
      alert("Title cannot be empty");
      return;
    }

    titleEl.textContent = newTitle;
    descEl.textContent = newDesc;
    priorityEl.textContent = newPriority;

    if (newDate) {
      dueDateEl.setAttribute("datetime", newDate);
    }

    editForm.style.display = "none";
    viewMode.style.display = "block";
  });

  cancelBtn.addEventListener("click", () => {
    editForm.style.display = "none";
    viewMode.style.display = "block";
  });
});


// EXPAND / COLLAPSE //

cards.forEach(card => {
  const toggleBtn = card.querySelector('[data-testid="test-todo-expand-toggle"]');
  const collapsible = card.querySelector('[data-testid="test-todo-collapsible-section"]');

  toggleBtn.addEventListener("click", () => {
    const isHidden = collapsible.hasAttribute("hidden");

    if (isHidden) {
      collapsible.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.textContent = "Collapse";
    } else {
      collapsible.setAttribute("hidden", "");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "Expand";
    }
  });
});



// TIME LOGIC //
function updateTime() {
  document.querySelectorAll('[data-testid="test-todo-card"]').forEach(card => {
    const timeEl = card.querySelector('[data-testid="test-todo-time-remaining"]');
    const dueDateEl = card.querySelector('[data-testid="test-todo-due-date"]');
    const status = card.querySelector('[data-testid="test-todo-status"]')?.textContent;

    if (!timeEl || !dueDateEl) return;

    if (status === "Done") {
      timeEl.textContent = "Completed";
      return;
    }

    const due = new Date(dueDateEl.getAttribute("datetime"));
    if (isNaN(due.getTime())) return;

    const diff = due - new Date();

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (diff > 0) {
      if (days > 0) {
        timeEl.textContent = `Due in ${days} day(s)`;
      } else if (hours > 0) {
        timeEl.textContent = `Due in ${hours} hour(s)`;
      } else {
        timeEl.textContent = `Due in ${mins} minute(s)`;
      }
    } else {
      const overdue = Math.abs(mins);
      timeEl.textContent = `Overdue by ${overdue} minute(s)`;
    }
  });
}

updateTime();
setInterval(updateTime, 60000);