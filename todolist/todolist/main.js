const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter");
const toggleThemeBtn = document.getElementById("toggleTheme");

window.addEventListener("load", () => {
  loadTasks();
  loadTheme();
});

// Adiciona nova tarefa com id único
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;
  const newTask = {
    id: Date.now().toString(),
    text,
    status: "pending",
  };
  addTask(newTask);
  taskInput.value = "";
  saveNewTask(newTask);
  applyFilter(getActiveFilter());
});

function addTask(taskObj) {
  const li = document.createElement("li");
  li.className = `task ${taskObj.status}`;
  li.dataset.id = taskObj.id;  // Armazena o id no atributo data-id
  li.innerHTML = `
    <span class="task-text">${taskObj.text}</span>
    <div class="task-controls">
      <button class="doBtn" aria-label="Marcar como Fazendo">🕐</button>
      <button class="doneBtn" aria-label="Marcar como Concluído">✅</button>
      <button class="deleteBtn" aria-label="Excluir tarefa">🗑️</button>
    </div>
  `;

  const doBtn = li.querySelector(".doBtn");
  const doneBtn = li.querySelector(".doneBtn");
  const deleteBtn = li.querySelector(".deleteBtn");

  doBtn.addEventListener("click", () => {
    updateStatus(taskObj.id, "doing");
  });

  doneBtn.addEventListener("click", () => {
    updateStatus(taskObj.id, "done");
  });

  deleteBtn.addEventListener("click", () => {
    removeTask(taskObj.id);
  });

  taskList.appendChild(li);
}

// Salvando nova tarefa no localStorage (mantém as existentes)
function saveNewTask(newTask) {
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
}

// Busca array de tarefas do localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

// Salva array de tarefas no localStorage
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Carrega e renderiza todas tarefas
function loadTasks() {
  const tasks = getTasks();
  taskList.innerHTML = "";
  tasks.forEach(addTask);
  applyFilter(getActiveFilter());
}

// Atualiza status de tarefa pelo id
function updateStatus(id, newStatus) {
  const tasks = getTasks().map(t =>
    t.id === id ? { ...t, status: newStatus } : t
  );
  saveTasks(tasks);
  loadTasks();
}

// Remove tarefa pelo id
function removeTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  loadTasks();
}

// Tema
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleThemeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    toggleThemeBtn.textContent = "☀️";
  } else {
    toggleThemeBtn.textContent = "🌙";
  }
}

// Filtros
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

function getActiveFilter() {
  return document.querySelector(".filter.active").dataset.filter;
}

// Aplica filtro visual (esconde ou mostra tarefas)
function applyFilter(type) {
  document.querySelectorAll(".task").forEach(task => {
    const status = ["pending", "doing", "done"].find(s => task.classList.contains(s));
    task.style.display =
      type === "all" || type === status ? "flex" : "none";
  });
}
