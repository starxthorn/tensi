import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  description: {
    type: String,
  },
  cnic: {
    type: Number,
  },
  cnic_picture: {
    type: String,
  },
  location: {
    type: String,
  },
  phone: {
    type: Number,
  },
  verified: {
    type: String,
    default: "not verified",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Ensure this references the correct model
    },
  ],
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Ensure this references the correct model
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Ensure this references the correct model
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
