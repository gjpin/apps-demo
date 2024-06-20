const axios = require('axios');
const crypto = require('crypto')
const TraceParent = require('traceparent');

// Generate traceparent
const generateTraceparent = () => {
    const version = Buffer.alloc(1).toString('hex');
    const traceId = crypto.randomBytes(16).toString('hex');
    const id = crypto.randomBytes(8).toString('hex');
    const flags = '01';

    const header = `${version}-${traceId}-${id}-${flags}`;

    return TraceParent.fromString(header);
}

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to make a GET request with a traceparent header
const getCar = async () => {
  const carID = getRandomInt(1, 1000000);
  const traceId = generateTraceparent();

  try {
    const response = await axios.get(`http://bff1.apps-demo/car/${carID}`, {
      headers: {
        'traceparent': traceId
      }
    });
    
    // Log successful response
    console.log(`Response for CAR ID ${carID}:`, response.data);
  } catch (error) {
    // Log error response
    console.error(`Error for CAR ID ${carID}:`, error.message);
  }
};

// Function to make a POST request with a traceparent header
const postExtras = async () => {
  const carID = getRandomInt(1, 1000000);
  const extraID = getRandomInt(1, 1000000);
  const traceId = generateTraceparent();

  try {
    const response = await axios.post(`http://bff2.apps-demo/car/${carID}/extras/${extraID}`, {
      headers: {
        'traceparent': traceId
      }
    });
    
    // Log successful response
    console.log(`Response for CAR ID ${carID} and EXTRA ID ${extraID}:`, response.data);
  } catch (error) {
    // Log error response
    console.error(`Error for CAR ID ${carID} and EXTRA ID ${extraID}:`, error.message);
  }
};

// Function to set a random delay between 0.2ms and 1.5s
const setRandomDelay = (callback) => {
  const delay = getRandomInt(0.2, 1500);
  setTimeout(async () => {
    await callback();
    setRandomDelay(callback);
  }, delay);
};

// Start making requests
setRandomDelay(getCar);
setRandomDelay(postExtras);