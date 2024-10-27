const express = require('express');
const redis = require('redis');

const app = express();
const port = 3001;

// Redis client
const client = redis.createClient({
    host: 'redis-service', // Replace with your actual Redis service name
    port: 6379 // Or your Redis port
});

client.on('error', (err) => console.error('Redis Client Error', err));

app.get('/data', (req, res) => {
    // Fetch data from Redis (you might need to modify this based on your data structure)
    client.keys("*", (err, keys) => {
        if (err) {
            console.error('Error fetching keys:', err);
            res.status(500).send('Error fetching data');
        } else {
            // Fetch data for each key
            Promise.all(keys.map(key => new Promise((resolve, reject) => {
                client.get(key, (err, value) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ key, value });
                    }
                });
            })))
            .then(data => {
                // Process the data and send a response (e.g., convert data to JSON)
                const processedData = data.map(item => ({
                    timestamp: parseInt(item.key), 
                    data: JSON.parse(item.value)
                }));
                res.json(processedData);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                res.status(500).send('Error fetching data');
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});