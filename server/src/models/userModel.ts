import bcrypt from "bcrypt";

import mongoose from "mongoose";
interface User {
  name: string;
  emai: string;
  password: string;
  passwordConfirm: string;
  image?: string;
  passwordChangedAt?: Date;
}
const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "من فضلك ادخل الاسم"],
      maxLength: 40,
      unique: true,
    },
    role:{
      type: String,
      enum : ['user','admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, "من فضلك ادخل الرقم السري"],
      maxLength: 50,
      minLenght: 5,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "من فضلك أكد الرقم السري"],
      validate: {
        validator: function (this: User, el: string) {
          return el == this.password;
        },
        message: "الرقم السري غير متطابق",
      },
    },
  },
  { timestamps: true }
);
userModel.pre("save", async function (next) {
  const user: any = this;
  // Only run this function if password was modified
  if (!user.isModified("password")) return next();

  // Hash the password with cost of 12
  user.password = await bcrypt.hash(user.password, 12);
  user.passwordConfirm = undefined

  next();
});

const User = mongoose.model("User", userModel);

export default User;
