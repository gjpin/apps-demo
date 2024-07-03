const express = require('express');
const axios = require('axios');
const crypto = require('crypto')
const TraceParent = require('traceparent');

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to forward the request to backend1.com and return the response
const forwardRequest = async (req, res) => {
  const { carID, extraID } = req.params;
  const traceparentHeader = req.headers['traceparent'];

  console.log('Received request at /car/carID/extras/extraID');
  console.log("traceparent header from app: " + traceparentHeader)

  // create new traceparent with same traceid
  const traceparentBuffer = TraceParent.fromString(traceparentHeader);
  const newSpanId = crypto.randomBytes(8).toString('hex');
  const newTraceparentHeader = "00-" + traceparentBuffer.traceId + "-" + newSpanId + "-01";

  console.log("new traceparent header: " + newTraceparentHeader)

  // Simulate 1% chance of receiving an error
  const errorChance = getRandomInt(1, 100);
  if (errorChance === 1) {
    const errorTypes = [500, 503, 504, 403];
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)];
    return res.status(errorType).send(`Simulated ${errorType} error`);
  }

  const axiosConfig = {
    headers: {
      'traceparent': newTraceparentHeader
    }
  };

  try {
    const response = await axios.get(`http://backend1.apps-demo:8080/data/car/${carID}/extras/${extraID}`, axiosConfig);

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
