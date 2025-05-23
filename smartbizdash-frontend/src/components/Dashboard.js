import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentPage from "./AppointmentPage"; // You'll create this
import "../styles/Dashboard.css"; // Optional: style like TeacherDashboard
import CompletedAppointmentsWidget from "./CompletedAppointmentsWidget";
import Navbar from "./Navbar"; // Adjust path if needed


function Dashboard() {
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });

        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        } else {
          const errorData = await res.json();
          console.error("Fetch /me error:", errorData);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Network error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <h3 className="welcome-message">Welcome, {email}! 👋</h3>
            <div className="widget-container">
              <CompletedAppointmentsWidget />
            </div>
          </>
        );
      case "appointments":
        return <AppointmentPage />;
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src="/logodash.png" alt="SmartBizDash Logo" className="logo" />
        <ul>
          <li
            onClick={() => setActiveSection("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            Dashboard
          </li>
          <li
            onClick={() => setActiveSection("appointments")}
            className={activeSection === "appointments" ? "active" : ""}
          >
            Appointments
          </li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>

      <div className="content">
        {/* <h2>
          {activeSection === "appointments"
            ? "Appointment Manager"
            : "Dashboard"}
        </h2> */}

        <Navbar
          title={
            activeSection === "appointments"
              ? "Appointment Manager"
              : "Dashboard"
          }
          email={email}
        />

        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard;
