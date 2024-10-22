import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
