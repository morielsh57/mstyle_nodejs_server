const express = require("express");
const path = require("path");
const http = require("http");
const fileUpload = require("express-fileupload");
const {routesInit , corseAccessControl} = require("./routes/config_routes");
const mongoConnect = require("./db/mongoConnect");

const app = express();

app.use(fileUpload({
  limits:{ fileSize: 5*1024*1024}
}))


app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

corseAccessControl(app);

routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || "3004";
server.listen(port);
