const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const User = require("./models/user");
const { valiDateSingUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const user = require("./models/user");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

//async use kiya kyunki DB operation time leta hai
app.post("/signUp", async (req, res) => {
  try {
    //validate the Data
    valiDateSingUpData(req); //utils k andar validation file hai usme h yeh function

    // Encrpt the password validate password using bcrypt hash k form m password rakhte h database m
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // creating instance of new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email INVALID");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Creating JWT TOKEN  user._id object id h yh
      const token = await jwt.sign({ _id: user._id }, "DEVTinder@123",{expiresIn:"7d"});
      
      console.log(token);

      //add the token to cookie & send the espone back to user
      res.cookie("token", token);
      res.send("LOGGED IN SUCCESFULLY");
    } else {
      throw new Error("Password INCORRECT");
    }
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //validate my token

    if (!user) {
      throw new Error("USER doesnot Exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

app.post("/sentConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending connection request");
  res.send(user.firstName + " sents the connection request");
});

// GET user by EMAIL yeh batygi ki duplicate emailid ki email h ya nhi hai to konsi (1st one0) print hogi
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.findOne({ emailId: userEmail });
//     res.send(users);
//   } catch (err) {
//     res.status(404).send("email id incorrect:" + err.message);
//   }
// });

// //yeh feed API -get Feed m kon kon h sabka data degi
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(404).send("feed not showing " + err.message);
//   }
// });

// //create delete user api
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const users = await User.findByIdAndDelete(userId);
//     res.send("user deleted succesfully");
//   } catch (err) {
//     res.status(400).send("user not deleted yet" + err.message);
//   }
// });

// //update data of user api with uid (patch api partial update ke liye use hoti hai.)
// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = [
//       "userId",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//     ];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k),
//     );
//     if (!isUpdateAllowed) {
//       res.status(400).send("Updates not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("   skills must be less than 10");
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       //jis user ki id ye hai usko find karo,data
//       returnDocument: "after",
//       runValidators: "true",
//     });
//     res.send("user updated succesfully");
//   } catch (err) {
//     res.status(400).send("UPDATE FAILED" + err.message);
//   }
// });

connectDb()
  .then(() => {
    console.log("Connection Established Successfully");
    app.listen(3000, () => {
      console.log("Server Is Sucessfully Listen On Port 3000");
    });
  })
  .catch((err) => {
    console.log("error db not connected yet ");
  });
