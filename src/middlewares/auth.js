//dekh rha h token is valid &   user is ffound valid to next mein bhjo

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token fromreq cookie
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("TOKEN INVALID");
    }
    const DecodedObj = await jwt.verify(token, "DEVTinder@123");
    const { _id } = DecodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("USEr not found");
    }
   req.user=user
    next(); //call when to move to request handler
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
};

module.exports = { userAuth };
