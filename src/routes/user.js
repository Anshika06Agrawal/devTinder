const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//Get all the pending connection request for the loggedIn user

userRouter.get("/user/request/recevied", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills",
    );
    //fromUserId ko User collection se join karo ===> Sirf ye fields bhejo =======Populate is used to replace a referenced ObjectId with the actual document data from another collection. It works similarly to a JOIN in SQL.

    //"Why are you using populate instead of storing the entire user object in ConnectionRequest?"
    //To avoid data duplication and maintain a single source of truth. Only the User ID is stored, and user details are fetched when needed using populate. 🚀

    //sql m esse likhte query SELECT *
    // FROM ConnectionRequest
    // JOIN User
    // ON ConnectionRequest.fromUserId = User.id

    res.json({ message: "Data fetched Succesfully", data: connectionRequests });
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { forUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName LastName skills about")
      .populate("toUserId", "firstName LastName skills about");

    // res.json({ message: "Data fetched Succesfully", data: connectionRequests });

    console.log(connectionRequests);
    const data = connectionRequests.map((row) => {
      if (row.forUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //User should see all the user cards except
    // his own card
    //his connections
    //ignored people
    //alerady sent the connection request

    // params  -> URL ke andar
    // query   -> ? ke baad
    // body    -> request ke andar JSON
    // cookies -> browser me stored

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
    //find all connection request (sent + recevied)
    //Mujhe sari requests do jisme main involved hu.
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //yaha maine phle dundha ki kon kon hai alerady meri friendlist m, then unko feed se hide ekro to vo fromuser se bhi ho skte h touser se bhi and set issley qki unqiue rhe feed
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    console.log(hideUserFromFeed);

    //$nin means not in $ne means not equal
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName LastName skills about")
      .skip(skip)
      .limit(limit);

    // res.send(connectionRequests);
    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

module.exports = userRouter;
