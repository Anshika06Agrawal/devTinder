const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNode:Juhi98%4012@namastenode.doivyns.mongodb.net/NamasteNodeDB",
  );
};

module.exports = connectDb;

