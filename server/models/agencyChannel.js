// models/AgencyChannel.js
import mongoose from "mongoose";

const agencyChannelSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    designation: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
    numberOfPartnerMeet: { type: Number, default: 0 },
    motorLoginPremium: { type: Number, default: 0 },
    healthLoginPremium: { type: Number, default: 0 },
    liLoginPremium: { type: Number, default: 0 },
    numberOfFscOnboarding: { type: Number, default: 0 },
    numberOfFileLogin: { type: Number, default: 0 },
    mutualFund: { type: Number, default: 0 },
    numberOfSip: { type: Number, default: 0 },
    insurancePremium: { type: Number, default: 0 },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("AgencyChannel", agencyChannelSchema);
