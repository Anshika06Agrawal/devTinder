const mongoose = require("mongoose");
const validator =require("validator")

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
    validate(value){
      if(!validator.isEmail(value)){
        throw new error("Invalid Email " +value)
      }
    }
  },

  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new error("Enter a strong password " +value)
      }
    }
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
    validate(value){
      if(!validator.isURL(value)){
        throw new error("Invalid photoURL " +value)
      }
    }
  },
},{
  timestamps:true,
  versionKey:false
});

module.exports = mongoose.model("User", userSchema);
