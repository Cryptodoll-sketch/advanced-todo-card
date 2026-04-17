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