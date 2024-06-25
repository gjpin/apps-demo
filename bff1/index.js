const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const TraceParent = require('traceparent');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to forward the request to backend1.com and return the response
const forwardRequest = async (req, res) => {
  const { carID } = req.params;
  const url = `http://backend1.apps-demo:3000/data/car/${carID}`;

  // create new traceparent with same traceid
  const traceparentHeader = req.headers['traceparent'];
  const traceparentBuffer = TraceParent.fromString(traceparentHeader);
  const newSpanId = crypto.randomBytes(8).toString('hex');
  const newTraceparentHeader = "00-" + traceparentBuffer.traceId + "-" + newSpanId + "-01";

  try {
    const response = await axios.get(url, {
      headers: {
        'traceparent': newTraceparentHeader
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

// Set up the route to handle GET requests at /car/carID
app.get('/car/:carID', forwardRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
