const { createClient } = require('@redis/client');

async function run() {
    // Create a Redis client
    const client = createClient({
        host: 'redis-service', // Replace with your Redis service name
        port: 6379             // Your Redis port
    });

    try {
        // Connect to Redis
        await client.connect();
        console.log('Connected to Redis');

        // Send PING command
        const response = await client.ping();
        console.log('Response from Redis:', response);

        // Check for PONG response
        if (response === 'PONG') {
            console.log('Received PONG, exiting...');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the Redis client
        await client.quit();
        process.exit(0); // Exit the process
    }
}

// Run the function
run();
