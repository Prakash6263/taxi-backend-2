//client.js
var io = require('socket.io-client');// Connect to the server with JWT token passed in the query parameters


export default class ClientSocket {


    static async connect(data,socketName) {
        const socket = io('http://localhost:9211', {
            query: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjFhMzA1NjA2NDUyNjlhYWFlMDQ0NWIiLCJlbWFpbCI6Im1vaGFuQHlvcG1haWwuY29tIiwidHlwZSI6IlVzZXIiLCJpYXQiOjE3MTQwMzQ4MzAsImV4cCI6MTcxNDEyMTIzMH0.x9l6y2jI3CZjioqCL-V09YpJ079509MvaDyNU69NFM4"
            }
        });

        // Add a connect listener
        socket.on('connect', function (socket) {
            console.log('Connected!');
        });
        socket.emit(socketName, data);
    }

}