const experess = require ("express");
const requestRouter= experess.Router()
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sentConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending connection request");
  res.send(user.firstName + " sents the connection request");
});

module.exports=requestRouter