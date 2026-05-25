const validator = require("validator");

const valiDateSingUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is Not VALID");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is Not VALID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Passowrd is Not VALID");
  }
};

module.exports = { valiDateSingUpData };
