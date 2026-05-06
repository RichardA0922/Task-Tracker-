const API_URL = "/api/v1/tasks";

const state = {
    tasks: [],
    filter: "today",
    editingTaskId: null
};

const elements = {
    taskList: document.getElementById("taskList"),
    emptyState: document.getElementById("emptyState"),
    viewTitle: document.getElementById("viewTitle"),
    viewSubtitle: document.getElementById("viewSubtitle"),
    modalTitle: document.getElementById("modalTitle"),
    title: document.getElementById("title"),
    description: document.getElementById("description"),
    date: document.getElementById("date"),
    priority: document.getElementById("priority"),
    status: document.getElementById("status"),
    openModalBtn: document.getElementById("openModalBtn"),
    cancelBtn: document.getElementById("cancelBtn"),
    submitBtn: document.getElementById("submitBtn"),
    modal: document.getElementById("modal"),
    filterButtons: document.querySelectorAll("[data-filter]")
};

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    fetchTasks();
});

/* API */
async function fetchTasks() {
    const res = await fetch(API_URL);
    state.tasks = res.ok ? await res.json() : [];
    render();
}

async function createTask(task) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });

    if (!res.ok) {
        alert("Unable to create task. Please check the values and try again.");
        return;
    }

    const created = await res.json();
    state.tasks.push(created);
    render();
}

async function updateTask(task, id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });

    if (!res.ok) {
        alert("Unable to update task.");
        return;
    }

    const updated = await res.json();
    state.tasks = state.tasks.map(t => t.id === updated.id ? updated : t);
    render();
}

async function deleteTask(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
        alert("Unable to delete task.");
        return;
    }
    state.tasks = state.tasks.filter(t => t.id !== id);
    render();
}

/* Events */
function bindEvents() {
    elements.openModalBtn.onclick = openCreateModal;
    elements.cancelBtn.onclick = () => toggleModal(false);
    elements.submitBtn.onclick = handleSubmit;

    elements.filterButtons.forEach(btn => {
        btn.onclick = () => {
            state.filter = btn.dataset.filter;
            setActive(btn);
            render();
        };
    });

    elements.taskList.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const taskId = button.dataset.taskId;
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (button.dataset.action === "toggle") {
            toggleStatus(task);
        } else if (button.dataset.action === "delete") {
            deleteTask(taskId);
        } else if (button.dataset.action === "edit") {
            openEditModal(task);
        }
    });
}

function handleSubmit() {
    const taskData = {
        title: elements.title.value.trim(),
        description: elements.description.value.trim() || null,
        dueDate: elements.date.value || null,
        priority: elements.priority.value
    };

    if (!taskData.title) {
        alert("Please provide a task title.");
        return;
    }

    if (!taskData.priority) {
        alert("Please select a priority.");
        return;
    }

    if (state.editingTaskId) {
        const updatePayload = {
            ...taskData,
            status: elements.status.value
        };
        updateTask(updatePayload, state.editingTaskId);
    } else {
        createTask(taskData);
    }

    clearForm();
    toggleModal(false);
}

function openCreateModal() {
    state.editingTaskId = null;
    elements.modalTitle.textContent = "New Task";
    elements.submitBtn.textContent = "Create Task";
    elements.status.classList.add("hidden");
    clearForm();
    toggleModal(true);
}

function openEditModal(task) {
    state.editingTaskId = task.id;
    elements.modalTitle.textContent = "Edit Task";
    elements.submitBtn.textContent = "Save Changes";
    elements.status.classList.remove("hidden");

    elements.title.value = task.title;
    elements.description.value = task.description || "";
    elements.date.value = task.dueDate || "";
    elements.priority.value = task.taskPriority || "";
    elements.status.value = task.status || "OPEN";

    toggleModal(true);
}

/* Render */
function render() {
    elements.taskList.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    let filtered = state.tasks;

    if (state.filter === "today") {
        filtered = filtered.filter(t => t.dueDate === today && t.status === "OPEN");
        elements.viewSubtitle.textContent = "Open tasks due today.";
    } else if (state.filter === "scheduled") {
        filtered = filtered.filter(t => t.dueDate && t.status === "OPEN");
        elements.viewSubtitle.textContent = "Open tasks that are scheduled.";
    } else if (state.filter === "completed") {
        filtered = filtered.filter(t => t.status === "COMPLETE");
        elements.viewSubtitle.textContent = "Tasks that are complete.";
    } else {
        elements.viewSubtitle.textContent = "All tasks in the system.";
    }

    elements.viewTitle.textContent = state.filter === "all" ? "All Tasks" : state.filter.charAt(0).toUpperCase() + state.filter.slice(1);

    if (filtered.length === 0) {
        elements.emptyState.classList.remove("hidden");
        return;
    }

    elements.emptyState.classList.add("hidden");

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = `task priority-${task.taskPriority || "LOW"} ${task.status === "COMPLETE" ? "completed" : ""}`;

        li.innerHTML = `
            <div>
                <strong>${escapeHtml(task.title)}</strong>
                <div class="task-meta">
                    <span class="status-chip">${task.status}</span>
                    <span>${task.taskPriority}</span>
                    ${task.dueDate ? `<span>${new Date(task.dueDate).toLocaleDateString()}</span>` : ""}
                </div>
                <small>${escapeHtml(task.description || "")}</small>
            </div>
            <div class="task-actions">
                <button data-action="toggle" data-task-id="${task.id}">${task.status === "COMPLETE" ? "Undo" : "Done"}</button>
                <button data-action="edit" data-task-id="${task.id}">Edit</button>
                <button data-action="delete" data-task-id="${task.id}">✖</button>
            </div>
        `;

        elements.taskList.appendChild(li);
    });
}

/* Helpers */
function toggleStatus(task) {
    const updatedTask = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.taskPriority,
        status: task.status === "COMPLETE" ? "OPEN" : "COMPLETE"
    };
    updateTask(updatedTask, task.id);
}

function clearForm() {
    elements.title.value = "";
    elements.description.value = "";
    elements.date.value = "";
    elements.priority.value = "";
}

function toggleModal(show) {
    elements.modal.classList.toggle("hidden", !show);
}

function setActive(btn) {
    elements.filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
