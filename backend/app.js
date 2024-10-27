const express = require('express');
const { createClient } = require('@redis/client');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Redis client
const client = createClient({
    host: 'redis-service', // Replace with your actual Redis service name
    port: 6379             // Or your Redis port
});

// Handle Redis client errors
client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
client.connect()
    .then(() => {
        console.log('Connected to Redis');

        // Define the /data POST route
        app.post('/data', async (req, res) => {
            const data = req.body;
            const timestamp = Date.now(); // Get current timestamp

            try {
                // Store data in Redis (key: timestamp, value: data)
                await client.set(timestamp.toString(), JSON.stringify(data));
                console.log('Data stored successfully:', timestamp, data);
                res.status(200).send('Data stored successfully');
            } catch (err) {
                console.error('Error storing data in Redis:', err);
                res.status(500).send('Error storing data');
            }
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });

    })
    .catch((error) => {
        console.error('Failed to connect to Redis:', error);
    });

// Gracefully handle shutdown
process.on('SIGINT', async () => {
    console.log('Closing Redis client');
    await client.quit();
    process.exit(0);
});
