// backend/models/products.js
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "catagory name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [500, "Product description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Home Appliances",
        "cars/trucks",
        "Motorcycles",
        "Bicycles",
        "Real Estate",
        "Fashion",
        "Toys",
        "Sports",
        "health & Beauty",
        "animals",
        "Furniture",
        "Clothing",
        "Books",
        "Services",
        "Misc",
      ], // example categories
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      enum: ["North", "South", "East", "West", "Central"], // example regions setup
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // Cloudinary public id for deletion if applicable
      },
    ],
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User who posted the listing
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // To allow soft delete or deactivate listing
    },
  },
  {
    timestamps: true, // createdAt and updatedAt fields auto-managed by Mongoose
  }
);

module.exports = mongoose.model("Listing", listingSchema);
