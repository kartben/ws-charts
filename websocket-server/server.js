const WebSocket = require('ws');
const { sin, PI } = Math;

const wss = new WebSocket.Server({ port: 8081 });

let angle = 0;

wss.on('connection', (ws) => {
        console.log('Client connected');

        const sendSensorData = () => {
                if (ws.readyState === WebSocket.OPEN) {
                        angle += 0.1;
                        if (angle > 2 * PI) {
                                angle = 0;
                        }
                        const sensorData = {
                                value: 50 + 50 * sin(angle) // Sine wave value between 0 and 100
                        };
                        ws.send(JSON.stringify(sensorData));
                }
        };

        const interval = setInterval(sendSensorData, 100);

        ws.on('close', () => {
                console.log('Client disconnected');
                clearInterval(interval);
        });

        ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                clearInterval(interval);
        });
});

console.log('WebSocket server is running on ws://localhost:8081');
