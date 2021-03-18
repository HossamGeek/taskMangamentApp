require("dotenv").config();
const express = require("express"),
  logger = require("morgan"),
  cors = require("cors"),
  app = express(),
  endPoint = require("./services/endpoint.routes"),
  corsOptions = {
    exposedHeaders: "x-auth-token"
  },
  PORT = 3000;

//config app
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors(corsOptions));
endPoint(app);//start endpoint
app.listen( PORT, () => {
  console.log("server listen in PORT " +  PORT);
});
