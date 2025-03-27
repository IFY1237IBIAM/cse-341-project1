// swagger helps us auto-gen our .json
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Books Api",
        description: "Books Api"
    },
    host: "localhost: 3001",
    schemes: ['https', 'http']

};
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// this will now generate swagger.son
swaggerAutogen(outputFile, endpointsFiles, doc);



