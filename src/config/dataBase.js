const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNode:Juhi98%4012@namastenode.doivyns.mongodb.net/NamasteNodeDB",
  );
};

connectDb()
  .then(() => {
    console.log("connection established successfully");
  })
  .catch((err) => {
    console.log("error db not connected yet ");
  });


