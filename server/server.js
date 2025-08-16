import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import XLSX from "xlsx";
import Partner from "./models/partnerModel.js";
import AgencyChannel from "./models/agencyChannel.js";

const app = express();
app.use(cors());
app.use(express.json());

dayjs.extend(utc);
dayjs.extend(timezone);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://formservices10:orCFD0tIt4zjfMD3@cluster0.8wlv5xx.mongodb.net/partnersDB"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* -------------------- PARTNER APIs -------------------- */

// Save Partner form data
app.post("/api/partners", async (req, res) => {
  try {
    const data = req.body;
    if (data.dateTime) data.dateTime = new Date(data.dateTime);
    const newPartner = new Partner(data);
    await newPartner.save();
    res.status(201).json({ message: "Partner form saved successfully" });
  } catch (err) {
    console.error("❌ Save Partner error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Export Partner data to Excel
app.get("/api/partners/excel", async (req, res) => {
  try {
    const partners = await Partner.find().lean();
    if (!partners.length) {
      return res.status(404).json({ message: "No partner data found" });
    }

    const formattedData = partners.map((p) => ({
      "Employee Name": p.employeeName,
      "Date & Time": p.visitingDateTime
        ? dayjs(p.visitingDateTime)
            .tz("Asia/Kolkata")
            .format("DD-MM-YYYY hh:mm A")
        : "",
      "Partner Name": p.partnerName,
      "Partner Contact": p.partnerContactNumber,
      "Partner Email": p.partnerEmail,
      "Shop Name": p.shopName,
      "City/Village": p.cityVillage,
      Tehsil: p.tehsil,
      District: p.district,
      State: p.state,
      "Onboarding Status": p.onboardingStatus,
      "Partner Image": p.retailerImage,
      Latitude: p.latitude,
      Longitude: p.longitude,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    worksheet["!cols"] = Object.keys(formattedData[0]).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...formattedData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Partners");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=partners_data.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (err) {
    console.error("❌ Excel Partner error:", err);
    res.status(500).json({ message: "Error generating Partner Excel" });
  }
});

/* -------------------- AGENCY CHANNEL APIs -------------------- */

// Save AgencyChannel form data
app.post("/api/agency", async (req, res) => {
  try {
    const data = req.body;
    if (data.dateTime) data.dateTime = new Date(data.dateTime);
    const newAgency = new AgencyChannel(data);
    await newAgency.save();
    res.status(201).json({ message: "Agency Channel form saved successfully" });
  } catch (err) {
    console.error("❌ Save Agency error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Export AgencyChannel data to Excel
app.get("/api/agency/excel", async (req, res) => {
  try {
    const agencyData = await AgencyChannel.find().lean();
    if (!agencyData.length) {
      return res.status(404).json({ message: "No agency data found" });
    }

    const formattedData = agencyData.map((a) => ({
      "Employee Name": a.employeeName,
      Designation: a.designation,
      "Date & Time": p.visitingDateTime
        ? dayjs(p.visitingDateTime)
            .tz("Asia/Kolkata")
            .format("DD-MM-YYYY hh:mm A")
        : "",
      "Number of Partner Meet": a.numberOfPartnerMeet,
      "Motor Login Premium": a.motorLoginPremium,
      "Health Login Premium": a.healthLoginPremium,
      "LI Login Premium": a.liLoginPremium,
      "Number of FSC Onboarding": a.numberOfFscOnboarding,
      "Number of File Login": a.numberOfFileLogin,
      "Mutual Fund": a.mutualFund,
      "Number of SIP": a.numberOfSip,
      "Insurance Premium": a.insurancePremium,
      Latitude: a.latitude,
      Longitude: a.longitude,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    worksheet["!cols"] = Object.keys(formattedData[0]).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...formattedData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AgencyChannel");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=agency_channel_data.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (err) {
    console.error("❌ Excel Agency error:", err);
    res.status(500).json({ message: "Error generating Agency Excel" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
