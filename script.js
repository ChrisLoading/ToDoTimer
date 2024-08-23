function handleEnterKey(event, callback) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default behavior
    callback(); // Execute the provided callback function
  }
}

//Add LIST ITEM
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

  // Function to finalize the list name
  function finalizeListName() {
    const trimmedName = newListItem.textContent.trim();
    if (trimmedName === "") {
      // Remove the list item if the name is empty or just spaces
      listItems.removeChild(newListItem);
    } else {
      // Finalize the name and remove the editable state
      newListItem.contentEditable = false; // Disable editing
      newListItem.classList.remove("editable"); // Remove highlightby
      newListItem.textContent = trimmedName; // Update with trimmed name
    }
  }

  // Handle the ENTER key press to finish renaming
  newListItem.addEventListener("keydown", function (event) {
    handleEnterKey(event, finalizeListName);
  });

  // Remove the 'editable' class once the user clicks out of the new list item
  newListItem.addEventListener("blur", finalizeListName);
}

// Attach the addList function to the button's click event
document.getElementById("addListButton").addEventListener("click", addList);

// Add CONTEXT MENU
// Show the context menu on right-click
document.addEventListener("contextmenu", function (event) {
  event.preventDefault();

  const contextMenu = document.getElementById("contextMenu");
  contextMenu.style.display = "block";
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;

  // Remember which item was clicked
  contextMenu.targetElement = event.target;
});

// Hide the context menu when clicking anywhere else
document.addEventListener("click", function () {
  document.getElementById("contextMenu").style.display = "none";
});

// Handle the Delete option
document.getElementById("deleteOption").addEventListener("click", function () {
  const targetElement = document.getElementById("contextMenu").targetElement;
  if (targetElement && targetElement.tagName === "LI") {
    targetElement.remove();
  }
});

// Handle the Rename option
document.getElementById("renameOption").addEventListener("click", function () {
  const targetElement = document.getElementById("contextMenu").targetElement;
  if (targetElement && targetElement.tagName === "LI") {
    targetElement.contentEditable = true;
    targetElement.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(targetElement);
    selection.removeAllRanges();
    selection.addRange(range);

    targetElement.addEventListener("keydown", function (event) {
      handleEnterKey(event, function () {
        targetElement.contentEditable = false;
      });
    });

    targetElement.addEventListener("blur", function () {
      targetElement.contentEditable = false;
    });
  }
});
