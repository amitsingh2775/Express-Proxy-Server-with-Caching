const express = require('express');
const app = express();
const PORT = 4000;

// Simple route to return data
app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the backend server!' });
});

app.get('/chat', (req, res) => {
    res.json({ message: 'Hello from the chat!' });
  });

// Start the backend server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
