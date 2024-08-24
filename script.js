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
    newListItem.contentEditable = false; // Disable editing
    newListItem.classList.remove("editable"); // Remove highlight
    newListItem.textContent = trimmedName; // Update with trimmed name
  }
}

// Function to add a new list item
function addList() {
  // Create a new list item
  const newListItem = document.createElement("li");

  // Set it to be editable and highlighted
  newListItem.contentEditable = true;
  newListItem.classList.add("editable");
  newListItem.textContent = "New List";

  // Append the new list item to the list
  const listItems = document.getElementById("listItems");
  listItems.appendChild(newListItem);

  // Automatically focus on the new list item so the user can start editing
  newListItem.focus();

  // Select and highlight the text "New List"
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(newListItem);
  selection.removeAllRanges();
  selection.addRange(range);

  // Handle the ENTER key press to finish renaming
  function handleKeydown(event) {
    handleEnterKey(event, function () {
      finalizeListName(newListItem);
    });
  }

  // Attach event listeners to finalize the list name
  newListItem.addEventListener("keydown", handleKeydown);
  newListItem.addEventListener("blur", function () {
    finalizeListName(newListItem);
  });

  // Attach the context menu to the new list item
  attachContextMenuToItem(newListItem);
}

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

// Initialize context menu for existing list items on page load
document.querySelectorAll("#listItems li").forEach(attachContextMenuToItem);

// Add new list items and attach the context menu to them
document.getElementById("addListButton").addEventListener("click", function () {
  addList();
});

// Hide the context menu when clicking anywhere else
document.addEventListener("click", function () {
  document.getElementById("contextMenu").style.display = "none";
});

// Prevent the default context menu from showing when right-clicking on context menu items
document
  .getElementById("contextMenu")
  .addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

// Handle the Delete option
function handleDeleteOptionClick(event) {
  if (event.button === 0) {
    // Only handle left-click
    event.preventDefault(); // Prevent any default actions
    const targetElement = document.getElementById("contextMenu").targetElement;
    if (targetElement && targetElement.tagName === "LI") {
      targetElement.remove();
    }
    document.getElementById("contextMenu").style.display = "none"; // Hide the context menu after action
  }
}

// Handle the Rename option
function handleRenameOptionClick(event) {
  if (event.button === 0) {
    // Only handle left-click
    event.preventDefault(); // Prevent any default actions
    const targetElement = document.getElementById("contextMenu").targetElement;
    if (targetElement && targetElement.tagName === "LI") {
      targetElement.contentEditable = true;
      targetElement.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(targetElement);
      selection.removeAllRanges();
      selection.addRange(range);

      function handleKeydown(event) {
        handleEnterKey(event, finalizeRename);
      }

      function finalizeRename() {
        targetElement.contentEditable = false;
      }

      // Remove existing listeners to prevent duplicate Event Triggers and Memory Leaks
      targetElement.removeEventListener("keydown", handleKeydown);
      targetElement.removeEventListener("blur", finalizeRename);

      // Reattach listeners for the current renaming operation
      targetElement.addEventListener("keydown", handleKeydown);
      targetElement.addEventListener("blur", finalizeRename);
    }
    document.getElementById("contextMenu").style.display = "none"; // Hide the context menu after action
  }
}

// Attach the event listeners for only left clicks to the context menu options
document
  .getElementById("deleteOption")
  .addEventListener("mousedown", handleDeleteOptionClick);
document
  .getElementById("renameOption")
  .addEventListener("mousedown", handleRenameOptionClick);

// Main-Content Funtionality

// Data structure for tasks
const tasks = {
  "Default List 1": ["Task 1 for List 1", "Task 2 for List 1"],
  "Default List 2": ["Task 1 for List 2", "Task 2 for List 2"],
  // Add more lists and tasks as needed
};
