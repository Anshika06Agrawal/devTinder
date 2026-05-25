const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { valiDateSingUpData } = require("./utils/validation");

app.use(express.json());

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
    if (!isPasswordValid) {
      throw new Error("Password INCORRECT");
    } else {
      res.send("LOGGED IN SUCCESFULLY");
    }
  } catch (err) {
    res.status(400).send("ERROR :  " + err.message);
  }
});

// yeh batygi ki duplicate emailid ki email h ya nhi hai to konsi (1st one0) print hogi
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    res.send(users);
  } catch (err) {
    res.status(404).send("email id incorrect:" + err.message);
  }
});

//yeh feed m kon kon h sabka data degi
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("feed not showing " + err.message);
  }
});

//create delete user api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (err) {
    res.status(400).send("user not deleted yet" + err.message);
  }
});

//update user api with uid (patch api partial update ke liye use hoti hai.)
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      res.status(400).send("Updates not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("   skills must be less than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      //jis user ki id ye hai usko find karo,data
      returnDocument: "after",
      runValidators: "true",
    });
    res.send("user updated succesfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED" + err.message);
  }
});

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
