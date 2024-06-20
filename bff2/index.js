const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to forward the request to backend1.com and return the response
const forwardRequest = async (req, res) => {
  console.log('Received POST request at /car/carID/extras/extraID');

  const { carID, extraID } = req.params;
  const traceparent = req.headers['traceparent'];
  const url = `http://backend1.apps-demo/data/car/${carID}/extras/${extraID}`;

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
        'traceparent': traceparent
      }
    })
    console.log("made request to backend1");
    ;

    // Forward the response from backend1.com to the client
    res.status(response.status).send(response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(`Error fetching data for carID ${carID} and extraID ${extraID}:`, error.message);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

// Route to handle POST requests at /car/:carID/extras/:extraID
app.post('/car/:carID/extras/:extraID', forwardRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
