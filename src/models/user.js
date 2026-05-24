const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
  },

  lastName: {
    type: String,
  },

  emailId: {
    type: String,
    lowerCase: true,
    index: true, //fast searching
    trim: true,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    min: 18,
  },

  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new error("gender data is not valid");
      }
    },
  },

  skills: {
    type: [String],
  },

  about: {
    type: String,
    default: "Hi this is about my career",
  },
  photoURL: {
    type: String,
    default: "https://share.google/4unrpMO8f5FSkpoZp",
  },
},{
  timestamps:true,
  versionKey:false
});

module.exports = mongoose.model("User", userSchema);
