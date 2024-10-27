// Mock device (run in a separate terminal)
function sendData() {
    const data = {
        temperature: Math.random() * 30,
        humidity: Math.random() * 100
    };

    // Calculate the timestamp for 4 hours ago
    const timestamp = Date.now() - (4 * 60 * 60 * 1000); // 4 hours in milliseconds

    fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data, timestamp }) // Include the timestamp in the body
    })
    .then(res => console.log('Data sent:', res))
    .catch(err => console.error('Error sending data:', err));
}

// Send data every 5 seconds (adjust as needed)
setInterval(sendData, 5000);
