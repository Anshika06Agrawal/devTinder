const validator = require("validator");

const validateSingUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is Not VALID");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is Not VALID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Passowrd is Not VALID");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFeilds = [
    "firstName",
    "lastName",
    "password",
    "photoURL",
    "gender",
    "age",
    "skills",
    "about",
  ];

  //Object.keys yh age gender skills and all hai=======Object.keys(req.body)  yh vo h jo user chhata h edit krna h , hum dekh rhe h n ki jo user cha rha h edit krna vo allowedEditFeilds ke andar hai ya nhi .agr h to boolean return kr dega  isEditAllowed
  const isEditAllowed = Object.keys(req.body).every((feild) =>
    allowedEditFeilds.includes(feild),
  );
  return isEditAllowed;
};

module.exports = { validateSingUpData, validateEditProfileData };
