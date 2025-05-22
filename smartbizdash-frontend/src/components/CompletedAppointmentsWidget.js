// src/components/CompletedAppointmentsWidget.js
import React, { useEffect, useState } from "react";

function CompletedAppointmentsWidget() {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/appointments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const completed = data.filter((appt) => appt.status === "Complete");
          setCompletedCount(completed.length);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="widget-card completed-widget">
      <h4>Completed Appointments</h4>
      <p className="count">{completedCount}</p>
    </div>
  );
}

export default CompletedAppointmentsWidget;
