import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  stock: {
    type: Number,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
