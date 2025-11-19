const express = require('express');
const axios = require('axios');
const crypto = require('crypto')

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to forward the request to backend1.com and return the response
const forwardRequest = async (req, res) => {
  const { carID } = req.params;

  // console.log('Received request at /car/carID');

  const baseUrl = process.env.BACKEND1_BASE_URL || 'http://backend1.demo-apps.svc.cluster.local:8080';
  try {
    const response = await axios.get(`${baseUrl}/data/car/${carID}`);

    // Forward the response from backend1.com to the client
    // console.log(`backend1 response: `, JSON.stringify(response.headers));
    res.status(response.status).send(response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    // console.log(`backend1 error`, error);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
};

// Set up the route to handle GET requests at /car/carID
app.get('/car/:carID', forwardRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
