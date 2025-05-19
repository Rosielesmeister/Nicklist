import mongoose from "mongoose";


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
      ],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
 
    region: {
      type: String,
      required: [true, "Region is required"],
      enum: ["North", "South", "East", "West", "Central"], 
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
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
        },
        message: "Please enter a valid email address",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
