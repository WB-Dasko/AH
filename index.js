const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require ("dotenv");

const bodyParser= require ("body-parser");
const swaggerJsdoc= require ("swagger-jsdoc");
const swaggerUi =require ("swagger-ui-express");

dotenv.config();

const PORT = process.env.PORT;
const URL = process.env.URL || localhost

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Dasko Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      // contact: {
      //   name: "LogRocket",
      //   url: "https://logrocket.com",
      //   email: "info@email.com",
      // },
    },
    // servers: [
    //   {
    //     url: "https://dasko-api-test.azurewebsites.net/",
    //   },
    //   {
    //     url: `http://localhost:${PORT}`,
    //   },
    // ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);


app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use(require("./routes/data"));
// get driver connection

const db = require("./db/conn");

app.listen(PORT, () => {
  //perform a database connection when server starts
  db.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${PORT}`);
});
