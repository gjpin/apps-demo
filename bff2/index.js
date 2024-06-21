const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle the traceparent header
app.use((req, res, next) => {
  const traceparentHeader = req.header('traceparent');
  if (traceparentHeader) {
      res.setHeader('traceparent', traceparentHeader);
  }
  next();
});

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to forward the request to backend1.com and return the response
const forwardRequest = async (req, res) => {
  const { carID, extraID } = req.params;
  const traceparentHeader = req.headers['traceparent'];
  const url = `http://backend1.apps-demo:3000/data/car/${carID}/extras/${extraID}`;

  // Simulate 1% chance of receiving an error
  const errorChance = getRandomInt(1, 100);
  if (errorChance === 1) {
    const errorTypes = [500, 503, 504, 403];
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)];
    return res.status(errorType).send(`Simulated ${errorType} error`);
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'traceparent': traceparentHeader
      }
    });

    // Forward the response from backend1.com to the client
    console.log(`backend1 response: `, JSON.stringify(response.headers));
    res.status(response.status).send(response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.log(`backend1 error`, error);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

// Route to handle POST requests at /car/:carID/extras/:extraID
app.post('/car/:carID/extras/:extraID', forwardRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
