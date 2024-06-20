const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Function to forward the request to backend1.com and return the response
const forwardRequest = async (req, res) => {
  console.log('Received GET request at /car/carID');

  const { carID } = req.params;
  const traceparent = req.headers['traceparent'];
  const url = `http://backend1.apps-demo:3000/data/car/${carID}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'traceparent': traceparent
      }
    });

    // Forward the response from backend1.com to the client
    res.status(response.status).send(response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(`Error fetching data for CAR ID ${carID}:`, error.message);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

// Set up the route to handle GET requests at /car/carID
app.get('/car/:carID', forwardRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
