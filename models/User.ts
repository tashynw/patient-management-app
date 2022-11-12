import { models, model, Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Patient",
  },
  age: {
    type: Number,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
