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

// Endpoint /data/car/:carID
app.get('/data/car/:carID', (req, res) => {
  console.log('Received GET request at /data/car/carID');

  const { carID } = req.params;
  const traceparentHeader = req.headers['traceparent'];

  // Simulate 2% chance of returning a 404 error
  const errorChance = getRandomInt(1, 100);
  if (errorChance <= 2) {
    return res.status(404).send('Car ID not found');
  }

  // Otherwise, return success message
  res.status(200).send('Your car ID has full battery');
});

// Endpoint /data/car/:carID/extras/:extraID
app.get('/data/car/:carID/extras/:extraID', async (req, res) => {
  console.log('Received GET request at /data/car/carID/extras/extraID');

  const { carID, extraID } = req.params;
  const traceparentHeader = req.headers['traceparent'];
  const url = `http://backend2.apps-demo:3000/sales/extras`;

  // Simulate 0.5% chance of returning a 402 or 401 error
  const errorChance = getRandomInt(1, 200);
  if (errorChance === 1) {
    const errorTypes = [502, 401];
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)];
    return res.status(errorType).send(`Simulated ${errorType} error`);
  }

  try {
    // Make POST request to backend2.com
    const response = await axios.post(url, {
      carID: carID,
      extraID: extraID
    }, {
      headers: {
        'traceparent': traceparentHeader
      }
    });

    // Forward the response from backend2.com to the client
    console.log(`backend2 response`, response);
    res.status(response.status).send(response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.log(`backend2 error`, error);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
