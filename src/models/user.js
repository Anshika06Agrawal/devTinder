const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new error("Invalid Email " + value);
        }
      },
    },

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new error("Enter a strong password " + value);
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new error("Invalid photoURL " + value);
        }
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//arrow func ke sath this keyword kaam nhi krti
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEVTinder@123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  //compare m phle userpasword aayega then hashpassword
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
