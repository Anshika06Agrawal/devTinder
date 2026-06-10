const experess = require("express");
const requestRouter = experess.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

// fromuserId is person who is already loggedIn
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUser = req.user;
      const fromUserId = req.user._id; //loggedIn vale ki is hai yh
      const toUserId = req.params.toUserId;
      const toUser = await User.findById(toUserId);
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(404)
          .json({ message: "INVALID status type :" + status });
      }

      // yaha p check kr rhe ki jisko request bhej rhe vo db m hai ki nahi
      const toUsers = await User.findOne({ _id: toUserId });
      if (!toUsers) {
        return res.status(404).json({ message: "User not found" });
      }

      // jab user khud ko hi request bhejga vo case handel kiya h idhr
      // if(fromUserId==toUserId){
      //   return res
      //     .status(404)
      //     .send({ message: "we cant make connectionto ourself" });
      // }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exist" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${fromUser.firstName} is ${status} connection request ${toUser.firstName} Successfully! `,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :  " + err.message);
    }
  },
);

module.exports = requestRouter;
