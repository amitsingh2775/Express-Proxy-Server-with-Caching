const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

// Create an instance of express
const app = express();

// Initialize cache with a default TTL (time to live) of 1 hour
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Define the port for the proxy server
const PORT = process.env.PORT || 3000;
const BACKEND_SERVER_URL = 'http://localhost:4000'; // Change this to your actual backend server URL

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}, Method: ${req.method}`);
  next();
});

// Route to handle all requests
app.use(async (req, res) => {
  const cacheKey = req.url;

  // Check if the response is in the cache
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    console.log('Serving from cache');
    return res.send(cachedResponse);
  }

  // If not in the cache, forward the request to the backend server
  try {
    const backendResponse = await axios({
      method: req.method,
      url: `${BACKEND_SERVER_URL}${req.url}`,
      data: req.body,
      headers: req.headers,
    });

    // Store the response in the cache
    cache.set(cacheKey, backendResponse.data);

    // Send the response to the client
    res.send(backendResponse.data);
  } catch (error) {
    console.error('Error fetching from backend server:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Start the proxy server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
