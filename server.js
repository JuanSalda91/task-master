// 1. import dependencies
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db.js');

// 2. load environment variables from .env
dotenv.config();

// 3. create express app --- after creating the confi/db.js, we connect to the db febore starting the server.
connectDB()
const app = express();

// 4. global middleware
app.use(express.json()); // Parse incoming json bodies

// 5. (placeholder) routes
const userRoutes = require("./routes/api/userRoutes");
// mount user routes
app.use("/api/users", userRoutes);


// test route to check server
// app.get('/', (req, res) => {
//     res.json({ message: 'TaskMaster api is running.' });
// });

// 6. port from .env
const PORT = process.env.PORT || 5000;


// 7. start server listening on PORT. Later db will be connected before listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});