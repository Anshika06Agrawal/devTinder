const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    //fromUserId is logged in user
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //"Ye ObjectId User collection ki taraf point kar raha hai." Ref tells Mongoose which collection the ObjectId belongs to so that populate can fetch the related document.-
      require: "true",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: "true",
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUES} are incorrect for status type`,
      },
    },
  },
  { timestamps: true },
);

//Document save hone se JUST PEHLE ye function chalega
//pre Mongoose ka middleware (hook) hota hai,n   this = current document jo save ho raha hai
//pre middleware runs before a Mongoose operation (like save), and is used for validation or modification before data is stored in MongoDB.

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //compund interest -an index created on multiple fields to speed up queries that use those fields together.

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
