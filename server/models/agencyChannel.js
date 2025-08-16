// models/AgencyChannel.js
import mongoose from "mongoose";

const agencyChannelSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    designation: { type: String, required: true },
    dateTime: { type: Date, required: true }, // store actual Date object
    numberOfPartnerMeet: { type: Number, default: 0 },
    numberOfFsc: { type: Number, default: 0 },
    sipMp: { type: Number, default: 0 },
    insurancePremium: { type: Number, default: 0 },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("AgencyChannel", agencyChannelSchema);
