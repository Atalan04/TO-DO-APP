const addTodo = document.getElementById("add-todo");
const toDoDate = document.getElementById("todo-date");
const addButton = document
  .querySelector(".div-add-input")
  .querySelector(".add-button");
const todoButton = document
  .querySelector(".todo-buttons")
  .querySelectorAll(".todo-list button");

const deleteAll = document.querySelector(".deleteAll-button");
const alertMessage = document.getElementById("alert-message");

const alertShow = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

let isEditing = false;
let editingTask = null;

function addTaskToTable(taskObj) {
  const taskTable = document.querySelector(".task-table");

  const newRow = document.createElement("tr");
  const taskCell = document.createElement("td");
  const dateCell = document.createElement("td");
  const statusCell = document.createElement("td");
  const ActionsCell = document.createElement("td");

  taskCell.textContent = taskObj.task;
  dateCell.textContent = taskObj.date;
  statusCell.textContent = taskObj.status;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit");

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.classList.add("do");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete");

  doneBtn.addEventListener("click", () => {
    statusCell.textContent = "Done";

    // آپدیت در LocalStorage
    updateStatusInLocalStorage(taskObj, "Done");
  });

  deleteBtn.addEventListener("click", () => {
    newRow.remove();
    alertShow("Task Deleted!","error")
    deleteFromLocalStorage(taskObj);
  });

  editBtn.addEventListener("click", () => {
    addTodo.value = taskCell.textContent;
    toDoDate.value = dateCell.textContent;

    isEditing = true;
    editingTask = taskObj;

    newRow.remove();
    deleteFromLocalStorage(taskObj);
    addButton.textContent = "Edit";
  });

  ActionsCell.appendChild(editBtn);
  ActionsCell.appendChild(doneBtn);
  ActionsCell.appendChild(deleteBtn);

  newRow.appendChild(taskCell);
  newRow.appendChild(dateCell);
  newRow.appendChild(statusCell);
  newRow.appendChild(ActionsCell);

  taskTable.appendChild(newRow);
}

const taskHandler = () => {
  const task = addTodo.value;
  const date = toDoDate.value;

  if (task.trim() === "" || date.trim() === "") {
    alertShow("Please Enter task and Date", "error");
    return;
  }

  const taskObj = {
    task,
    date,
    status: "Pending",
  };

  addTaskToTable(taskObj);
  alertShow("Entering task done!", "success");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  addTodo.value = "";
  toDoDate.value = "";
};

const deleteHandler = () => {
  document.querySelectorAll(".task-table tr").forEach((row) => {
    if (row.querySelector("td")) {
      row.remove();
      alertShow("All task deleted!", "error");
    }
  });

  // پاک کردن از LocalStorage
  localStorage.removeItem("tasks");
};

const category = (cat) => {
  const catValue = cat.target.textContent.trim();
  const rows = document.querySelectorAll(".task-table tr");

  rows.forEach((row) => {
    const statusCell = row.children[2]; // 3rd column = status
    if (row.querySelector("th")) return;

    const statusText = statusCell.textContent.trim();

    if (catValue === "All" || catValue === statusText) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
};

function deleteFromLocalStorage(taskObj) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(
    (t) =>
      !(
        t.task === taskObj.task &&
        t.date === taskObj.date &&
        t.status === taskObj.status
      ),
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStatusInLocalStorage(taskObj, newStatus) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => {
    if (
      t.task === taskObj.task &&
      t.date === taskObj.date &&
      t.status === taskObj.status
    ) {
      return { ...t, status: newStatus };
    }
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// events
addButton.addEventListener("click", () => {
  if (isEditing) {
    const updatedTask = {
      task: addTodo.value,
      date: toDoDate.value,
      status: "Pending",
    };

    addTaskToTable(updatedTask);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(updatedTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    isEditing = false;
    addButton.textContent = "Add";

    addTodo.value = "";
    toDoDate.value = "";
  } else {
    taskHandler();
  }
});

todoButton.forEach((item) => {
  item.addEventListener("click", category);
});

deleteAll.addEventListener("click", deleteHandler);

window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToTable);
};
