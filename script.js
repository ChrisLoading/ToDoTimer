function handleEnterKey(event, callback) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default behavior
    callback(); // Execute the provided callback function
  }
}

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
  newListItem.addEventListener("keydown", function (event) {
    handleEnterKey(event, function () {
      newListItem.contentEditable = false;
      newListItem.classList.remove("editable");
    });
  });

  // Remove the 'editable' class once the user clicks out of the new list item
  newListItem.addEventListener("blur", function () {
    // Disable editing and Remove highlightby as well
    newListItem.contentEditable = false;
    newListItem.classList.remove("editable");
  });
}

// Attach the addList function to the button's click event
document.getElementById("addListButton").addEventListener("click", addList);
