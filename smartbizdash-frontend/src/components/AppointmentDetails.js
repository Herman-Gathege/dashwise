import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AppointmentDetail.css";

const API_URL = "http://localhost:5000/appointments";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- Added for navigation
  const [appointment, setAppointment] = useState(null);
  const [notes, setNotes] = useState("");

  // Fetch the appointment by ID
  useEffect(() => {
    fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointment");
        return res.json();
      })
      .then((data) => {
        setAppointment(data);
        setNotes(data.notes || "");
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  // Update the notes field while preserving other appointment data
  const handleNotesUpdate = () => {
    const updatedAppointment = {
      ...appointment,
      notes, // override only the notes field
    };

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedAppointment),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update notes");
        return res.json();
      })
      .then(() => {
        alert("Notes updated");
        setAppointment((prev) => ({ ...prev, notes }));
      })
      .catch((err) => console.error("Update error:", err));
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="detail-container">
      <h3>Appointment Details</h3>
      <p>
        <strong>Client:</strong> {appointment.clientName}
      </p>
      <p>
        <strong>Contact:</strong> {appointment.clientContact}
      </p>
      <p>
        <strong>Service:</strong> {appointment.service}
      </p>
      <p>
        <strong>Date:</strong> {appointment.date}
      </p>
      <p>
        <strong>Time:</strong> {appointment.time}
      </p>
      <p>
        <strong>Status:</strong> {appointment.status}
      </p>
      <p>
        <strong>Fee:</strong> {appointment.fee}
      </p>

      <label>
        <strong>Notes:</strong>
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter notes here..."
        rows={6}
        className="detail-notes"
      />

      <div className="detail-buttons">
        <button onClick={handleNotesUpdate} className="btn btn-primary">
          Save Notes
        </button>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Go Back
        </button>
      </div>
    </div>
  );
}

export default AppointmentDetail;
