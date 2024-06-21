const express = require('express');
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

// Route to handle POST requests at /sales/extras
app.post('/sales/extras', (req, res) => {
  console.log('Received POST request at /sales/extras');

  // Simulate 1.5% chance of returning an error (400 or 500)
  const errorChance = getRandomInt(1, 10000); // 1.5% chance
  if (errorChance <= 150) {
    const errorTypes = [400, 500];
    const errorType = errorTypes[getRandomInt(0, errorTypes.length - 1)];
    console.log('returned error');
    return res.status(errorType).send(`Simulated ${errorType} error`);
  }

  // Otherwise, return 201 Created
  res.status(201).send('Successfully created');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
