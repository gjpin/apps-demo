const axios = require('axios');
const crypto = require('crypto')

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getCar = async () => {
  const carID = getRandomInt(1, 1000000);

  const baseUrl = process.env.BFF1_BASE_URL || 'http://bff1.demo-apps.svc.cluster.local:8080';
  try {
    const response = await axios.get(`${baseUrl}/car/${carID}`);

    // Log successful response headers
    // console.log(`bff1 response headers: `, JSON.stringify(response.headers));
  } catch (error) {
    // Log error response
    console.error(`bff1 error: `, error.message);
  }
};

const postExtras = async () => {
  const carID = getRandomInt(1, 1000000);
  const extraID = getRandomInt(1, 1000000);

  const postData = {
    data: 'dummy-data'
  };

  const baseUrl = process.env.BFF2_BASE_URL || 'http://bff2.demo-apps.svc.cluster.local:8080';
  try {
    const response = await axios.post(`${baseUrl}/car/${carID}/extras/${extraID}`, postData);
    
    // Log successful response
    // console.log(`bff2 response: `, JSON.stringify(response.headers));
  } catch (error) {
    // Log error response
    // console.error(`bff2 error: `, error.message);
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