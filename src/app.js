const express = require("express");
const app = express();
require ("./config/dataBase")

app.listen(3000, () => {
  console.log("server is sucessfully listen on port 3000");
});

