const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    //fromUserId is logged in user
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: "true",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: "true",
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignored", "interested", "accepeted", "rejected"],
        message: `{VALUES} are incorrect for status type`,
      },
    },
  },
  { timestamps: true },
);

//Document save hone se JUST PEHLE ye function chalega
//pre Mongoose ka middleware (hook) hota hai,n   this = current document jo save ho raha hai
//pre middleware runs before a Mongoose operation (like save), and is used for validation or modification before data is stored in MongoDB.

connectionRequest.index({ fromUserId: 1, toUserId: 1 });  //compund interest -an index created on multiple fields to speed up queries that use those fields together.

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  //check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
