// Key Data structure for tracking lists and tasks
const appData = {
  lists: {
    "Default List 1": ["Task 1 for List 1", "Task 2 for List 1"],
    "Default List 2": ["Task 1 for List 2", "Task 2 for List 2"],
  },
};

// Function to save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem("appData", JSON.stringify(appData));
}

// Function to load data from localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("appData");
  if (savedData) {
    Object.assign(appData, JSON.parse(savedData));
  }
}

// Load data when the script runs
loadFromLocalStorage();

// Function to handle Enter key events
function handleEnterKey(event, callback) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default behavior
    callback(); // Execute the provided callback function
  }
}

// Function to finalize the list name
function finalizeListName(newListItem) {
  const trimmedName = newListItem.textContent.trim();
  if (trimmedName === "") {
    // Remove the list item if the name is empty or just spaces
    newListItem.parentElement.removeChild(newListItem);
  } else {
    // Finalize the name and remove the editable state
    newListItem.contentEditable = false;
    newListItem.classList.remove("editable");

    // Update the data structure and save
    if (!appData.lists[trimmedName]) {
      appData.lists[trimmedName] = [];
      saveToLocalStorage();
    }
  }
}

// Function to add a new list item
function addList() {
  const newListItem = document.createElement("li");
  newListItem.contentEditable = true;
  newListItem.classList.add("editable");
  newListItem.textContent = "New List";
  document.getElementById("listItems").appendChild(newListItem);
  newListItem.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(newListItem);
  selection.removeAllRanges();
  selection.addRange(range);

  function handleKeydown(event) {
    handleEnterKey(event, function () {
      finalizeListName(newListItem);
      displayTasks(newListItem.textContent.trim()); // Display tasks for the new list
    });
  }

  newListItem.addEventListener("keydown", handleKeydown);
  newListItem.addEventListener("blur", function () {
    finalizeListName(newListItem);
    displayTasks(newListItem.textContent.trim()); // Display tasks for the new list
  });

  attachContextMenuToItem(newListItem);
}

// Function to display tasks of the selected list
function displayTasks(listName) {
  const taskContainer = document.getElementById("taskItems");
  taskContainer.innerHTML = "";

  if (appData.lists[listName]) {
    appData.lists[listName].forEach((task, index) => {
      const taskItem = document.createElement("li");

      // Create the structure with task name and action buttons
      taskItem.innerHTML = `
        <span class="task-name">${task}</span>
        <span class="task-actions">
          <span class="rename-task">✏️</span>
          <span class="delete-task">🗑️</span>
        </span>
      `;

      // Attach event listeners to the buttons
      taskItem
        .querySelector(".rename-task")
        .addEventListener("click", function () {
          renameTask(listName, index, taskItem);
        });

      taskItem
        .querySelector(".delete-task")
        .addEventListener("click", function () {
          deleteTask(listName, index);
        });

      taskContainer.appendChild(taskItem);
    });
  } else {
    const placeholderTask = document.createElement("li");
    placeholderTask.textContent = "No tasks available";
    taskContainer.appendChild(placeholderTask);
  }

  document.getElementById("listTitle").textContent = listName;
}

// Function to rename a task
function renameTask(listName, taskIndex, taskItem) {
  const taskNameSpan = taskItem.querySelector(".task-name");
  taskNameSpan.contentEditable = true;
  taskNameSpan.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(taskNameSpan);
  selection.removeAllRanges();
  selection.addRange(range);

  function finalizeTaskRename() {
    const newTaskName = taskNameSpan.textContent.trim();
    if (newTaskName) {
      appData.lists[listName][taskIndex] = newTaskName;
      saveToLocalStorage();
    }
    taskNameSpan.contentEditable = false;
  }

  taskNameSpan.addEventListener("keydown", function (event) {
    handleEnterKey(event, finalizeTaskRename);
  });

  taskNameSpan.addEventListener("blur", finalizeTaskRename);
}

// Function to delete a task
function deleteTask(listName, taskIndex) {
  appData.lists[listName].splice(taskIndex, 1);
  saveToLocalStorage();
  displayTasks(listName);
}

// Initialize the app on page load
function initializeApp() {
  // Make sure all lists are rendered on page load
  const listContainer = document.getElementById("listItems");
  listContainer.innerHTML = "";

  Object.keys(appData.lists).forEach((listName) => {
    const listItem = document.createElement("li");
    listItem.textContent = listName;
    listContainer.appendChild(listItem);
    attachContextMenuToItem(listItem);
  });

  // Display tasks for the first list (or show a placeholder if none exist)
  const firstListName = Object.keys(appData.lists)[0] || "No Lists Available";
  displayTasks(firstListName);
}

window.onload = initializeApp;

// Function to handle clicks on list items
function handleListClick(event) {
  if (event.target.tagName === "LI") {
    const listName = event.target.textContent.trim();
    displayTasks(listName);
  }
}

// Attach the click event listener to the list items
document.getElementById("listItems").addEventListener("click", handleListClick);

// Function to add a new task to the current list
function addTaskToList(taskName, listName) {
  if (appData.lists[listName]) {
    appData.lists[listName].push(taskName);
    saveToLocalStorage();
    displayTasks(listName);
  }
}

// Event listener for the 'Add New Task' input
document
  .getElementById("newTaskInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const newTaskInput = event.target;
      const taskName = newTaskInput.value.trim();
      if (taskName) {
        const currentListName = document
          .getElementById("listTitle")
          .textContent.trim();
        addTaskToList(taskName, currentListName);
        newTaskInput.value = "";
      }
    }
  });

// Function to show the context menu
function showContextMenu(event) {
  event.preventDefault();
  const contextMenu = document.getElementById("contextMenu");
  contextMenu.style.display = "block";
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;
  contextMenu.targetElement = event.target;
}

// Function to attach the context menu to a list item
function attachContextMenuToItem(item) {
  item.addEventListener("contextmenu", showContextMenu);
}

document.querySelectorAll("#listItems li").forEach(attachContextMenuToItem);

document.getElementById("addListButton").addEventListener("click", addList);

document.addEventListener("click", function () {
  document.getElementById("contextMenu").style.display = "none";
});

document
  .getElementById("contextMenu")
  .addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

// Handle the Delete option from the context menu
function handleDeleteOptionClick(event) {
  const targetElement = document.getElementById("contextMenu").targetElement;
  if (targetElement && targetElement.tagName === "LI") {
    targetElement.remove();
    delete appData.lists[targetElement.textContent.trim()];
    saveToLocalStorage();
  }
  document.getElementById("contextMenu").style.display = "none";
}

// Handle the Rename option from the context menu
function handleRenameOptionClick(event) {
  const targetElement = document.getElementById("contextMenu").targetElement;
  if (targetElement && targetElement.tagName === "LI") {
    targetElement.contentEditable = true;
    targetElement.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(targetElement);
    selection.removeAllRanges();
    selection.addRange(range);

    function finalizeRename() {
      const newName = targetElement.textContent.trim();
      if (newName) {
        const oldName = Object.keys(appData.lists).find(
          (name) => name === targetElement.textContent.trim()
        );
        if (oldName && oldName !== newName) {
          appData.lists[newName] = appData.lists[oldName];
          delete appData.lists[oldName];
          saveToLocalStorage();
        }
      }
      targetElement.contentEditable = false;
    }

    targetElement.addEventListener("keydown", function (event) {
      handleEnterKey(event, finalizeRename);
    });

    targetElement.addEventListener("blur", finalizeRename);
  }
  document.getElementById("contextMenu").style.display = "none";
}

// Attach event listeners to context menu options
document
  .getElementById("deleteOption")
  .addEventListener("mousedown", handleDeleteOptionClick);
document
  .getElementById("renameOption")
  .addEventListener("mousedown", handleRenameOptionClick);

// Initial timer durations in seconds
const timers = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

// Current selected timer
let currentTimer = "pomodoro";
let countdownInterval;
let timerStartTime;
let timerEndTime;

// Function to update the timer display
function updateTimerDisplay() {
  const remainingTime = getRemainingTime();
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  document.getElementById("timer").textContent = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

// Function to get remaining time
function getRemainingTime() {
  const now = new Date().getTime();
  const remainingTime = Math.max(Math.floor((timerEndTime - now) / 1000), 0);
  return remainingTime;
}

// Function to start the countdown
function startCountdown() {
  clearInterval(countdownInterval);
  timerStartTime = new Date().getTime();
  timerEndTime = timerStartTime + timers[currentTimer] * 1000;
  saveTimerState();
  countdownInterval = setInterval(() => {
    const remainingTime = getRemainingTime();
    updateTimerDisplay();
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      alert("Time's up!");
      resetTimer(); // Reset the timer after it finishes
    }
  }, 1000);
}

// Function to switch timers
function switchTimer(newTimer) {
  currentTimer = newTimer;
  clearInterval(countdownInterval); // Stop the current countdown if any
  document
    .querySelectorAll(".timer-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`${newTimer}Btn`).classList.add("active");
  resetTimer();
  updateTimerDisplay();
}

// Function to reset the timer
function resetTimer() {
  clearInterval(countdownInterval);
  timerStartTime = null;
  timerEndTime = null;
  timers.pomodoro = 25 * 60;
  timers.shortBreak = 5 * 60;
  timers.longBreak = 15 * 60;
  saveTimerState();
  updateTimerDisplay();
}

// Save timer state to localStorage
function saveTimerState() {
  const state = {
    currentTimer,
    timerEndTime,
    timers,
  };
  localStorage.setItem("timerState", JSON.stringify(state));
}

// Load timer state from localStorage
function loadTimerState() {
  const savedState = JSON.parse(localStorage.getItem("timerState"));
  if (savedState) {
    currentTimer = savedState.currentTimer;
    timerEndTime = savedState.timerEndTime;
    Object.assign(timers, savedState.timers);
    if (timerEndTime) {
      startCountdown(); // Resume countdown if there is an ongoing timer
    }
    updateTimerDisplay();
  }
}

// Event listeners for timer buttons
document.getElementById("pomodoroBtn").addEventListener("click", function () {
  switchTimer("pomodoro");
});

document.getElementById("shortBreakBtn").addEventListener("click", function () {
  switchTimer("shortBreak");
});

document.getElementById("longBreakBtn").addEventListener("click", function () {
  switchTimer("longBreak");
});

// Event listener for the start button
document
  .getElementById("startTimerBtn")
  .addEventListener("click", startCountdown);

// Initialize display with the default timer
loadTimerState();
updateTimerDisplay();
