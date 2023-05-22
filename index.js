const express = require('express');
const app = express();
const port = 3000;

// Middleware to serve static files (e.g., index.html)
app.use(express.static('public'));

// Middleware to parse JSON data
app.use(express.json());

// In-memory storage for registered users (for demonstration purposes)
const users = [];
const books = [];

// Register endpoint
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation (you can add more complex validation as per your requirements)
  if (name || email || password) {
    return res.status(400).json({ error: 'Please provide name, email, and password' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // Create a new user object
  const newUser = {
    name,
    email,
    password
  };

  // Add the user to the in-memory storage
  users.push(newUser);

  // Redirect to the home page
  res.redirect('/');

});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = users.find(user => user.email === email);

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.redirect('/user');

  // Return success response
//   res.status(200).json({ message: 'Login successful' });
});

// Serve the signup.html page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// Serve the login.html page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Serve the user.html page
app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/public/user.html');
  });

// Serve the index.html (home page)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
// Function to generate a unique ID
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
// Endpoint to add a book
app.post('/user/add-book', (req, res) => {
    const { bookName } = req.body;
  
    // Basic validation (you can add more complex validation as per your requirements)
    if (!bookName) {
      return res.status(400).json({ error: 'Please provide a book name' });
    }
  
    // Generate a unique ID for the book
    const bookId = generateUniqueId();
  
    // Save the book to the in-memory storage
    books.push({ id: bookId, name: bookName });
  
    // Return success response
    res.status(200).json({ success: true });
  });
  
  // Endpoint to fetch the list of books
  app.get('/user/books', (req, res) => {
    // Return the list of books
    res.status(200).json(books);
  });
  
  // Endpoint to edit a book
  app.put('/user/edit-book', (req, res) => {
    const { id, name } = req.body;
  
    // Find the book by ID
    const book = books.find(book => book.id === id);
  
    // Check if book exists
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    // Update the book name
    book.name = name;
  
    // Return success response
    res.status(200).json({ success: true });
  });
  
  // Endpoint to delete a book
  app.delete('/user/delete-book/:id', (req, res) => {
    const bookId = req.params.id;
  
    // Find the index of the book in the array
    const bookIndex = books.findIndex(book => book.id === bookId);
  
    // Check if book exists
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    // Remove the book from the array
    books.splice(bookIndex, 1);
  
    // Return success response
    res.status(200).json({ success: true });
  });
  

// Endpoint to fetch the list of books
app.get('/user/books', (req, res) => {
  // Return the list of books
  res.status(200).json(books);
});

// Serve the user.html page
app.get('/user', (req, res) => {
  res.sendFile(__dirname + '/public/user.html');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
