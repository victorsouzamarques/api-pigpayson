const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        "version": "1.0.0",                
        "title": "PICPAY-CRAQUE API",                  
        "description": "Api da maré que faz transferencia para o Pic Pay dos clientes"             
    },
    host: "localhost:3000",                         
    basePath: "/",                     
    schemes: ['http'],                     
    consumes: ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded', 'text/html'],                     
    produces: ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded', 'text/html'],                     
    tags: [                           
        {
            "name": "",               
            "description": ""         
        },
        // { ... }
    ],
    securityDefinitions: { },         
    definitions: { }                  
}

const outputFile = "./swagger_output.json";
const endpointsFiles = ["src/app/controllers/authController.js", "src/app/controllers/transferController.js"];

swaggerAutogen(outputFile, endpointsFiles, doc)