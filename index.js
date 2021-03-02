const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const queryPromise = require('./queryPromise');
const app = express();


//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = 3000;

//controllers 
const livre = require("./controllers/livre");
const style = require("./controllers/style");

livre(app,queryPromise);
style(app,queryPromise);



app.listen(port, function () {
  console.log(`server started :${port}`);
});
 