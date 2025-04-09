const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Task Management API",
        description: "API for managing users, tasks, and more"
    },
    host: "localhost:3001", // You can replace with your server if it's deployed
    schemes: ['http', 'https'], // HTTP and HTTPS
};

const outputFile = './swagger.json'; // Swagger JSON output
const endpointsFiles = ['./routes/index.js', './routes/user.js', './routes/task.js']; // Endpoints for auto-gen

swaggerAutogen(outputFile, endpointsFiles, doc);
