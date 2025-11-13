const express = require('express');
const axios = require('axios');
const crypto = require('crypto')

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Endpoint /data/car/:carID
app.get('/data/car/:carID', (req, res) => {
  console.log('Received request at /data/car/carID');

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

  console.log('Received request at /data/car/carID/extras/extraID');

  // Simulate 0.5% chance of returning a 402 or 401 error
  const errorChance = getRandomInt(1, 200);
  if (errorChance === 1) {
    const errorTypes = [502, 401];
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)];
    return res.status(errorType).send(`Simulated ${errorType} error`);
  }

  const postData = {
    data: 'dummy-data'
  };

  const baseUrl = process.env.BACKEND2_BASE_URL || 'http://backend2.demo-apps.svc.cluster.local:8080';
  try {
    const response = await axios.post(`${baseUrl}/sales/extras`, postData);

    // Forward the response from backend2.com to the client
    console.log(`backend2 response: `, JSON.stringify(response.headers));
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
