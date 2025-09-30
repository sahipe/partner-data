import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());

  // auto-update time
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Greeting based on hour
  const getGreeting = () => {
    const hour = dateTime.getHours();
    if (hour < 12) return "Good Morning 🌅";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}</h1>

        <p className="text-gray-600 text-lg">
          {dateTime.toLocaleDateString()} <br />
          {dateTime.toLocaleTimeString()}
        </p>

        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={() => navigate("/partner-form")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-green-700 transition"
          >
            Partner Form
          </button>

          <button
            onClick={() => navigate("/agency-form")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition"
          >
            Business Commitment For Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
