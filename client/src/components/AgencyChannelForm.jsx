import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AgencyChannelForm = () => {
  const initialState = {
    employeeName: "",
    designation: "",
    dateTime: new Date(), // keep Date object
    numberOfPartnerMeet: "",
    numberOfFsc: "",
    sipMp: "",
    insurancePremium: "",
    latitude: "",
    longitude: "",
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "numberOfPartnerMeet",
      "numberOfFsc",
      "sipMp",
      "insurancePremium",
    ];

    if (numericFields.includes(name)) {
      if (value === "" || validator.isNumeric(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (validator.isEmpty(form.employeeName)) {
      newErrors.employeeName = "Employee Name is required";
    }
    if (validator.isEmpty(form.designation)) {
      newErrors.designation = "Designation is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const numericFields = [
            "numberOfPartnerMeet",
            "numberOfFsc",
            "sipMp",
            "insurancePremium",
          ];

          const finalData = {
            ...form,
            latitude,
            longitude,
            dateTime: form.dateTime.toISOString(),
          };

          numericFields.forEach((field) => {
            finalData[field] = form[field] === "" ? 0 : Number(form[field]);
          });

          try {
            const res = await axios.post(
              "https://partner-data.onrender.com/api/agency",
              finalData
            );
            alert("Agency Channel form submitted successfully!");
            console.log("Saved:", res.data);

            setForm(initialState);
          } catch (error) {
            console.error("Error saving data:", error);
            alert("Failed to submit form. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Location error:", error);
          alert("Unable to fetch location. Please enable GPS.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation not supported in this browser.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Business Commitment For Today
        </h2>

        {/* Employee Name */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Employee Name
          </label>
          <input
            type="text"
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            className={`border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.employeeName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.employeeName && (
            <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className={`border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.designation ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
          )}
        </div>

        {/* Date Picker */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Visiting Date & Time
          </label>
          <DatePicker
            selected={form.dateTime}
            onChange={(date) =>
              setForm((prev) => ({ ...prev, dateTime: date }))
            }
            showTimeSelect
            dateFormat="dd/MM/yyyy, hh:mm a"
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Numeric Fields */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Number of Partner Meet
          </label>
          <input
            type="number"
            name="numberOfPartnerMeet"
            value={form.numberOfPartnerMeet}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Number of FSC
          </label>
          <input
            type="number"
            name="numberOfFsc"
            value={form.numberOfFsc}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">SIP/MP</label>
          <input
            type="number"
            name="sipMp"
            value={form.sipMp}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Insurance Premium
          </label>
          <input
            type="number"
            name="insurancePremium"
            value={form.insurancePremium}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full font-medium shadow hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AgencyChannelForm;
