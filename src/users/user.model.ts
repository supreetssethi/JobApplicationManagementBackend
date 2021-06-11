import mongoose from "mongoose";
import User from "./user.interface";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
      },
      last: {
        type: String,
        required: true,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value: String) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
      get: (): undefined => undefined,
    },
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);
userSchema.virtual("fullName").get(function (this: User) {
  return `${this.name.first} ${this.name.last}`;
});
const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
