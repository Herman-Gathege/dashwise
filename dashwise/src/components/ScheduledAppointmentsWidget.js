import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/fetchWithAuth';
import "../styles/Dashboard.css";

const ScheduledAppointmentsWidget = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchWithAuth("http://localhost:5000/appointments/scheduled");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="styled-widget">
      <h3>Upcoming Appointments</h3>
      {appointments.map((appt, idx) => (
        <div className="item" key={idx}>
          <div className="left">
          {appt.clientName}   – {appt.service}
          </div>
          <div className="right">
            {appt.time} <br /> {appt.date}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledAppointmentsWidget;
