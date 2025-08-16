import React, { useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { uploadImageToCloudinary } from "../hooks/uploadImage.js";
import validator from "validator";
import { Camera } from "lucide-react";

const PartnerForm = () => {
  const initialState = {
    employeeName: "",
    partnerName: "",
    partnerContactNumber: "",
    partnerEmail: "",
    shopName: "",
    cityVillage: "",
    tehsil: "",
    district: "",
    state: "",
    visitingDateTime: "",
    onboardingStatus: "",
    retailerImage: "",
    latitude: "",
    longitude: "",
  };

  const [form, setForm] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 Capture + Upload to Cloudinary
  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const url = await uploadImageToCloudinary(compressedFile);

      setForm((prev) => ({ ...prev, retailerImage: url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (validator.isEmpty(form.employeeName.trim())) {
      newErrors.employeeName = "Employee Name is required";
    }

    if (validator.isEmpty(form.partnerName.trim())) {
      newErrors.partnerName = "Partner Name is required";
    }

    if (!validator.isMobilePhone(form.partnerContactNumber, "en-IN")) {
      newErrors.partnerContactNumber = "Enter a valid 10-digit contact number";
    }

    if (!validator.isEmail(form.partnerEmail)) {
      newErrors.partnerEmail = "Enter a valid email address";
    }

    if (validator.isEmpty(form.shopName.trim())) {
      newErrors.shopName = "Shop Name is required";
    }

    if (validator.isEmpty(form.cityVillage.trim())) {
      newErrors.cityVillage = "City/Village is required";
    }

    if (validator.isEmpty(form.district.trim())) {
      newErrors.district = "District is required";
    }

    if (validator.isEmpty(form.state.trim())) {
      newErrors.state = "State is required";
    }

    if (validator.isEmpty(form.onboardingStatus.trim())) {
      newErrors.onboardingStatus = "Onboarding Status is required";
    }

    if (!form.retailerImage) {
      newErrors.retailerImage = "Retailer image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📍 Submit with Location
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const finalData = {
          ...form,
          latitude,
          longitude,
          visitingDateTime: new Date().toISOString(),
        };

        try {
          setSubmitting(true);

          const res = await axios.post(
            "http://localhost:5000/api/partners",
            finalData
          );

          alert("Form submitted successfully!");
          console.log("Saved response:", res.data);

          // ✅ Reset form after submission
          setForm(initialState);
          setErrors({});
        } catch (error) {
          console.error("Error saving partner:", error);
          alert("Failed to submit. Please try again.");
        } finally {
          setSubmitting(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to fetch location. Please enable GPS.");
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Partner Details Form
        </h2>

        {/* Employee Name */}
        <div>
          <input
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            placeholder="Employee Name"
            className={`border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.employeeName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.employeeName && (
            <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>
          )}
        </div>

        {/* Other Input Fields */}
        {[
          { name: "partnerName", placeholder: "Partner Name" },
          {
            name: "partnerContactNumber",
            placeholder: "Partner Contact Number",
          },
          { name: "partnerEmail", placeholder: "Partner Email ID" },
          { name: "shopName", placeholder: "Shop Name" },
          { name: "cityVillage", placeholder: "City/Village" },
          { name: "tehsil", placeholder: "Tehsil (Optional)" },
          { name: "district", placeholder: "District" },
          { name: "state", placeholder: "State" },
        ].map((field) => (
          <div key={field.name}>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Onboarding Status */}
        <div>
          <select
            name="onboardingStatus"
            value={form.onboardingStatus}
            onChange={handleChange}
            className={`border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.onboardingStatus ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Onboarding Status</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.onboardingStatus && (
            <p className="text-red-500 text-sm mt-1">
              {errors.onboardingStatus}
            </p>
          )}
        </div>

        {/* Camera Capture */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleCapture}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center justify-center bg-indigo-600 text-white w-12 h-12 rounded-full shadow hover:bg-indigo-700 transition"
          >
            <Camera className="w-6 h-6" />
          </button>

          {errors.retailerImage && (
            <p className="text-red-500 text-sm mt-2">{errors.retailerImage}</p>
          )}

          {uploading && (
            <p className="text-indigo-500 mt-2">Uploading image...</p>
          )}

          {form.retailerImage && !uploading && (
            <img
              src={form.retailerImage}
              alt="Retailer"
              className="w-32 h-32 object-cover mt-3 rounded-lg border"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || submitting}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg w-full font-medium shadow hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PartnerForm;
