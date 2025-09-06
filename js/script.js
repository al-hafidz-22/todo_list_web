// Ambil elemen DOM
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const todoTableBody = document.querySelector("#todo-table tbody");
const deleteButton = document.getElementById("delete-button");
const filterButton = document.getElementById("filter-button");

// Array untuk menyimpan task
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Filter saat ini
let currentFilter = "filter"; // status awal tombol

// Simpan todos ke localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Fungsi renderTodos untuk menampilkan task di tabel
function renderTodos(filter = "all") {
  todoTableBody.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all" || filter === "filter") return true;
    return todo.status === filter;
  });

  if (filteredTodos.length === 0) {
    todoTableBody.innerHTML = `
      <tr>
        <td colspan="4">Tidak ada tugas</td>
      </tr>
    `;
    return;
  }

  filteredTodos.forEach((todo, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.dueDate}</td>
      <td>
        <select data-index="${index}" class="status-select">
          <option value="Belum Selesai" ${
            todo.status === "Belum Selesai" ? "selected" : ""
          }>Belum Selesai</option>
          <option value="Sedang Dikerjakan" ${
            todo.status === "Sedang Dikerjakan" ? "selected" : ""
          }>Sedang Dikerjakan</option>
          <option value="Tertunda" ${
            todo.status === "Tertunda" ? "selected" : ""
          }>Tertunda</option>
          <option value="Selesai" ${
            todo.status === "Selesai" ? "selected" : ""
          }>Selesai</option>
        </select>
      </td>
      <td>
        <button data-index="${index}" class="delete-task">Hapus</button>
      </td>
    `;
    todoTableBody.appendChild(tr);
  });
}

// Event listener untuk select status
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("status-select")) {
    const idx = e.target.dataset.index;
    todos[idx].status = e.target.value;
    saveTodos();
  }
});

// Event listener untuk delete per task
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-task")) {
    const idx = e.target.dataset.index;
    todos.splice(idx, 1);
    saveTodos();
    renderTodos(currentFilter);
  }
});

// Tambah task baru
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  todos.push({
    task: todoInput.value,
    dueDate: todoDate.value,
    status: "Belum Selesai",
  });
  saveTodos();
  todoInput.value = "";
  todoDate.value = "";
  renderTodos(currentFilter);
});

// Fitur hapus semua
deleteButton.addEventListener("click", () => {
  todos = [];
  saveTodos();
  renderTodos(currentFilter);
});

// Fitur filter task berdasarkan status
filterButton.addEventListener("click", () => {
  switch (currentFilter) {
    case "filter":
      currentFilter = "Selesai";
      filterButton.textContent = "TAMPILKAN SELESAI";
      break;
    case "Selesai":
      currentFilter = "Belum Selesai";
      filterButton.textContent = "TAMPILKAN BELUM SELESAI";
      break;
    case "Belum Selesai":
      currentFilter = "Sedang Dikerjakan";
      filterButton.textContent = "TAMPILKAN SEDANG DIKERJAKAN";
      break;
    case "Sedang Dikerjakan":
      currentFilter = "Tertunda";
      filterButton.textContent = "TAMPILKAN TERTUNDA";
      break;
    case "Tertunda":
      currentFilter = "all";
      filterButton.textContent = "TAMPILKAN SEMUA";
      break;
    case "all":
      currentFilter = "filter";
      filterButton.textContent = "FILTER";
      break;
  }
  renderTodos(currentFilter);
});

// Render awal
renderTodos(currentFilter);
