const indexR = require("./index");
const usersR = require("./users");
const categoryR = require("./categories");
const productR = require("./products");
const emailR = require("./email");

exports.corseAccessControl = (app) => {
  app.all('*',  (req, res, next) => {
      if (!req.get('Origin')) return next();
      res.set('Access-Control-Allow-Origin', '*');
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
      res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token');
      next();
    });
}

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/categories", categoryR);
  app.use("/products", productR);
  app.use("/email", emailR);
  
  app.use((req,res) => {
    res.status(404).json({msg:"404 url page not found"})
  })
} 