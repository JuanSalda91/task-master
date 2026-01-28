// 1. import dependencies
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// 2. load environment variables from .env
dotenv.config();

// 3. create express app
const app = express();

// 4. global middleware
app.use(express.json()); // Parse incoming json bodies

// 5. (placeholder) routes


// test route to check server
app.get('/', (req, res) => {
    res.json({ message: 'TaskMaster api is running.' });
});

// 6. port from .env
const PORT = process.env.PORT || 5000;


// 7. start server listening on PORT. Later db will be connected before listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});