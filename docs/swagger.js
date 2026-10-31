const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "REST API Documentation for the E-Commerce Backend Project",
    },
    servers: [
      {
        url: "https://e-commerce-api-phi-sage.vercel.app",
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "./cart.swagger.js"),
    path.join(__dirname, "./category.swagger.js"),
    path.join(__dirname, "./order.swagger.js"),
    path.join(__dirname, "./password.swagger.js"),
    path.join(__dirname, "./products.swagger.js"),
    path.join(__dirname, "./review.swagger.js"),
    path.join(__dirname, "./users.swagger.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "E-Commerce API Documentation",
    }),
  );
};
