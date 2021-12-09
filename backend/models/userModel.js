const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter Name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your E-mail"],
    validate: [validator.isEmail, "Please Enter a valid E-mail"],
  },
  username: {
    type: String,
    required: [true, "Please Enter Your Username"],
    validate: {
      validator: function (val) {
        return !val.includes(" ");
      },
      message: "Username should not have space",
    },
  },
  bio: {
    type: String,
    maxlength: 150,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm your password"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Password confirm doesnot match",
    },
  },
  following: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  followers: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  profileImg: String,
  createdAt: Date,
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  //This function encrypts the password before saving it to the database

  //Run this function onle when password is changed
  if (!this.isModified("password")) next();

  //Encrypting password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Deleting passwordConfirm Feild
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  enteredPassword,
  dbPassword
) {
  return await bcrypt.compare(enteredPassword, dbPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimestamp < changedTimestamp;
  }

  return false; //does not change password
};

// userSchema.path("username").validate(async (value) => {
//   const count = await mongoose.models.User.countDocuments({
//     username: value,
//   });
//   return !count;
// }, "Username already exists");

//Unique Validator
["username", "email"].forEach((el) =>
  ((el) => {
    userSchema.path(el).validate(async (value) => {
      const queryObj = {};
      queryObj[el] = value;
      const count = await mongoose.models.User.countDocuments(queryObj);
      return !count;
    }, `${el} already exist`);
  })(el)
);

const User = mongoose.model("User", userSchema);

module.exports = User;
