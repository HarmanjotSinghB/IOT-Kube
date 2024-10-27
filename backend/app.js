const express = require('express');
const { createClient } = require('@redis/client');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

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

        // POST endpoint to store data
        app.post('/data', async (req, res) => {
            const data = req.body;
            const timestamp = Date.now();

            try {
                await client.set(timestamp.toString(), JSON.stringify(data));
                console.log('Data stored successfully:', timestamp, data);
                res.status(200).send('Data stored successfully');
            } catch (err) {
                console.error('Error storing data in Redis:', err);
                res.status(500).send('Error storing data');
            }
        });

        // GET endpoint to fetch data
        // GET endpoint to fetch data for the last 12 hours
app.get('/data', async (req, res) => {
    try {
        const currentTime = Date.now();
        const twelveHoursAgo = currentTime - (12 * 60 * 60 * 1000); // 12 hours in milliseconds
        
        const keys = await client.keys('*');
        const dataPromises = keys.map(async (key) => {
            const value = await client.get(key);
            const timestamp = parseInt(key);
            if (timestamp >= twelveHoursAgo) {
                return {
                    timestamp: timestamp,
                    data: JSON.parse(value)
                };
            }
        });

        const processedData = (await Promise.all(dataPromises)).filter(Boolean); // Filter out undefined values
        res.json(processedData);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
});

        // app.get('/data', async (req, res) => {
        //     try {
        //         const keys = await client.keys('*');
        //         const dataPromises = keys.map(async (key) => {
        //             const value = await client.get(key);
        //             return {
        //                 timestamp: parseInt(key),
        //                 data: JSON.parse(value)
        //             };
        //         });

        //         const processedData = await Promise.all(dataPromises);
        //         res.json(processedData);
        //     } catch (err) {
        //         console.error('Error fetching data:', err);
        //         res.status(500).send('Error fetching data');
        //     }
        // });

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
