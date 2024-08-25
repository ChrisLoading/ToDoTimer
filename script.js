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
    appData.lists[trimmedName] = [];
    saveToLocalStorage();
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
      displayTasks(trimmedName); // Display tasks for the new list
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
    appData.lists[listName].forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task;
      taskContainer.appendChild(taskItem);
    });
  } else {
    const placeholderTask = document.createElement("li");
    placeholderTask.textContent = "No tasks available";
    taskContainer.appendChild(placeholderTask);
  }

  document.getElementById("listTitle").textContent = listName;
}

// Initialize the app on page load
function initializeApp() {
  const firstListName = Object.keys(appData.lists)[0];
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
