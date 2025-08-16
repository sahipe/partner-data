import React, { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";

const ExcelDownload = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("partner"); // partner | agency

  const setQuickRange = (rangeType) => {
    const today = dayjs();
    let start, end;

    switch (rangeType) {
      case "today":
        start = today.startOf("day");
        end = today.endOf("day");
        break;
      case "yesterday":
        start = today.subtract(1, "day").startOf("day");
        end = today.subtract(1, "day").endOf("day");
        break;
      case "week":
        start = today.startOf("week");
        end = today.endOf("week");
        break;
      case "month":
        start = today.startOf("month");
        end = today.endOf("month");
        break;
      case "all":
        start = "";
        end = "";
        break;
      default:
        return;
    }

    setStartDate(start ? start.format("YYYY-MM-DD") : "");
    setEndDate(end ? end.format("YYYY-MM-DD") : "");
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;

      // API URL based on type selection
      const url =
        type === "partner"
          ? "http://localhost:5000/api/partners/excel"
          : "http://localhost:5000/api/agency/excel";

      const res = await axios.get(url, {
        params,
        responseType: "blob",
      });

      const fileName =
        type === "partner" ? "partners_data.xlsx" : "agency_channel_data.xlsx";

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Download Data
      </h3>

      {/* Select Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Select Data Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="partner">Partner Data</option>
          <option value="agency">Agency Channel Data</option>
        </select>
      </div>

      {/* Date Inputs */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setQuickRange("today")}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
        >
          Today
        </button>
        <button
          onClick={() => setQuickRange("yesterday")}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
        >
          Yesterday
        </button>
        <button
          onClick={() => setQuickRange("week")}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
        >
          Current Week
        </button>
        <button
          onClick={() => setQuickRange("month")}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
        >
          Current Month
        </button>
        <button
          onClick={() => setQuickRange("all")}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          Full Data
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Downloading..." : "Download Excel"}
      </button>
    </div>
  );
};

export default ExcelDownload;
