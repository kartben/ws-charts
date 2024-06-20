document.addEventListener('DOMContentLoaded', (event) => {
        const ctx = document.getElementById('sensorChart').getContext('2d');
        const data = {
                labels: [],
                datasets: [{
                        label: 'Sensor Data',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        data: [],
                }]
        };

        const config = {
                type: 'line',
                data: data,
                options: {
                        scales: {
                                x: {
                                        type: 'realtime',
                                        realtime: {
                                                delay: 0,
                                                refresh: 20,
                                                onRefresh: function (chart) {
                                                        chart.data.datasets[0].data.push({
                                                                x: Date.now(),
                                                                y: latestSensorValue
                                                        });
                                                }
                                        },
                                        title: {
                                                display: true,
                                                text: 'Time'
                                        },
                                        time: {
                                                unit: 'second'
                                        }
                                },
                                y: {
                                        beginAtZero: true
                                }
                        }
                }
        };

        const sensorChart = new Chart(ctx, config);

        let latestSensorValue = 0;

        // uncomment to use simulator (i.e. server in ./websocket-server/)
        // const socket = new WebSocket('ws://localhost:8081');
        const socket = new WebSocket('ws://192.168.1.180');

        socket.onopen = function (event) {
                console.log('WebSocket is connected.');
        };

        socket.onmessage = function (event) {
                console.log('Received sensor data:', event.data);
                const sensorData = JSON.parse(event.data);
                latestSensorValue = sensorData.value;
        };

        socket.onclose = function (event) {
                console.log('WebSocket is closed.');
        };

        socket.onerror = function (error) {
                console.error('WebSocket Error: ', error);
        };
});
