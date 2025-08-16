// models/Partner.js
import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    partnerName: { type: String, required: true },
    partnerContactNumber: { type: String, required: true },
    partnerEmail: { type: String, required: true },
    shopName: { type: String, required: true },
    cityVillage: { type: String, required: true },
    tehsil: { type: String },
    district: { type: String, required: true },
    state: { type: String, required: true },
    visitingDateTime: { type: Date, default: Date.now },

    retailerImage: { type: String }, // Cloudinary URL
    onboardingStatus: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
