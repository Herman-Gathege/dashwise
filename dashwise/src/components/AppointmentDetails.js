import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AppointmentDetail.css";

const API_URL = "http://localhost:5000/appointments";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const textareaRef = useRef(null);

  // Fetch appointment by ID
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

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // set to scrollHeight
    }
  }, [notes]);

  // Autosave notes on blur
  const handleBlur = () => {
    if (!appointment) return;
    if (notes === appointment.notes) return; // no changes, no save

    setSaveStatus("saving");
    const updatedAppointment = { ...appointment, notes };

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
        setAppointment((prev) => ({ ...prev, notes }));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(null), 2000); // clear message after 2 sec
      })
      .catch(() => {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(null), 3000);
      });
  };

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="detail-container">
      <h3>Appointment Details</h3>
      <p><strong>Client:</strong> {appointment.clientName}</p>
      <p><strong>Contact:</strong> {appointment.clientContact}</p>
      <p><strong>Service:</strong> {appointment.service}</p>
      <p><strong>Date:</strong> {appointment.date}</p>
      <p><strong>Time:</strong> {appointment.time}</p>
      <p><strong>Status:</strong> {appointment.status}</p>
      <p><strong>Fee:</strong> {appointment.fee}</p>

      <label htmlFor="notes"><strong>Notes:</strong></label>
      <textarea
        id="notes"
        ref={textareaRef}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add your notes here..."
        className="detail-notes"
        rows={4}
        style={{ resize: "vertical", minHeight: "100px" }}
      />
      {saveStatus === "saving" && <p className="save-status">Saving...</p>}
      {saveStatus === "saved" && <p className="save-status success">Notes saved ✓</p>}
      {saveStatus === "error" && <p className="save-status error">Error saving notes!</p>}

      <div className="detail-buttons">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Go Back
        </button>
      </div>
    </div>
  );
}

export default AppointmentDetail;
