const wss = new (require('ws').Server)({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);

        // Example response
        ws.send(JSON.stringify({ status: 'cool beans', received: message }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.warn('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
