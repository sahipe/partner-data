// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PartnerForm from "./components/PartnerForm";
import PartnerExcelDownload from "./components/PartnerExcelDownload";
import AgencyChannelForm from "./components/AgencyChannelForm";
import Home from "./pages/Home";
const App = () => {
  return (
    <Router>
      {/* Simple Navigation */}
      {/* <nav className="bg-gray-800 p-4 text-white flex gap-4">
        <Link to="/" className="hover:underline">
          Fill Form
        </Link>
        <Link to="/download" className="hover:underline">
          Download Data
        </Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partner-form" element={<PartnerForm />} />
        <Route path="/agency-form" element={<AgencyChannelForm />} />
        <Route path="/download" element={<PartnerExcelDownload />} />
      </Routes>
    </Router>
  );
};

export default App;
