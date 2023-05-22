// Function to display the list of books on the user page
function displayBooks() {
    fetch('/user/books')
      .then(response => response.json())
      .then(books => {
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';
  
        books.forEach(book => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item';
          listItem.textContent = book.name;
  
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.className = 'edit-btn btn btn-primary mx-2';
          editButton.addEventListener('click', () => handleEditButtonClick(book));
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'delete-btn btn btn-danger';
          deleteButton.addEventListener('click', () => handleDeleteButtonClick(book));
  
          listItem.appendChild(editButton);
          listItem.appendChild(deleteButton);
  
          bookList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  // Function to handle the click event of the "Edit" button
  function handleEditButtonClick(book) {
    const newBookName = prompt('Enter the new book name:', book.name);
  
    if (newBookName && newBookName !== book.name) {
      fetch('/user/edit-book', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: book.id, name: newBookName })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayBooks();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
  
  // Function to handle the click event of the "Delete" button
  function handleDeleteButtonClick(book) {
    if (confirm(`Are you sure you want to delete "${book.name}"?`)) {
      fetch(`/user/delete-book/${book.id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        displayBooks();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
  
  // Call the displayBooks function to initially load the list of books
  displayBooks();
  