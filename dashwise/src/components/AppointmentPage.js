import React, { useEffect, useState, useCallback, useRef } from "react";

import "../styles/AppointmentPage.css";
import { useNavigate } from "react-router-dom";

import {
  fetchAppointments,
  saveAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from "../services/appointmentsService";

function AppointmentPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientContact: "",
    service: "",
    date: "",
    time: "",
    fee: "",
    status: "Scheduled",
  });

  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;
  const menuRef = useRef(null);

  const filteredAppointments = appointments.filter((appt) =>
    appt.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAppt = currentPage * appointmentsPerPage;
  const indexOfFirstAppt = indexOfLastAppt - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppt,
    indexOfLastAppt
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const loadAppointments = useCallback(async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener on unmount or openMenuId change
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    if (selectedDate < today) {
      alert("You cannot select a past date for the appointment.");
      return;
    }

    try {
      await saveAppointment(formData, editingId);
      alert(editingId ? "Appointment updated!" : "Appointment added!");
      setFormData({
        clientName: "",
        clientContact: "",
        service: "",
        date: "",
        time: "",
        fee: "",
        status: "Scheduled",
      });
      setEditingId(null);
      loadAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;
    try {
      await deleteAppointment(id);
      alert("Appointment deleted!");
      loadAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment.");
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      clientName: appointment.clientName,
      clientContact: appointment.clientContact,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      fee: appointment.fee,
      status: appointment.status || "Scheduled",
    });
    setEditingId(appointment.id);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      loadAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="appt-container">
      <div className="form-section">
        <h4 className="form-head">
          {editingId ? "Edit Appointment" : "Add Appointment"}
        </h4>
        <form onSubmit={handleSubmit} className="appt-form">
          <input
            name="clientName"
            placeholder="Client Name"
            value={formData.clientName}
            onChange={handleChange}
            className="appt-input"
            required
          />
          <input
            name="clientContact"
            placeholder="Client Contact"
            value={formData.clientContact}
            onChange={handleChange}
            className="appt-input"
            required
          />
          <input
            name="service"
            placeholder="Service"
            value={formData.service}
            onChange={handleChange}
            className="appt-input"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="appt-input"
            required
            min={new Date().toISOString().split("T")[0]} // today's date
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="appt-input"
            required
          />
          <input
            name="fee"
            placeholder="Fee"
            value={formData.fee}
            onChange={handleChange}
            className="appt-input"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="appt-select"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit" className="appt-btn-submit">
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        <input
          type="text"
          className="appt-search"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Appointment list section */}
        <div className="appt-list-section">
          <h4 className="form-head">Your Appointments</h4>

          {appointments.length === 0 ? (
            <p className="appt-no-appointments">No appointments yet.</p>
          ) : (
            <>
              {/* Desktop/tablet: Appointment table */}
              <table className="appt-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Fee (Ksh)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((appt) => (
                    <tr key={appt.id} className="appt-row">
                      <td>{appt.clientName}</td>
                      <td>{appt.clientContact}</td>
                      <td>{appt.service}</td>
                      <td>{appt.date}</td>
                      <td>{appt.time}</td>
                      <td>{appt.fee}</td>
                      <td>
                        <strong
                          className={`appt-status appt-status-${appt.status.toLowerCase()}`}
                        >
                          {appt.status}
                        </strong>
                      </td>

                      <div className="appt-card-actions-menu">
                        <button
                          onClick={() => toggleMenu(appt.id)}
                          className="appt-btn appt-btn-menu"
                          aria-label="Open action menu"
                          title="Actions"
                        >
                          ⋮
                        </button>

                        {openMenuId === appt.id && (
                          <div className="appt-actions-dropdown" ref={menuRef}>
                            <button
                              onClick={() => {
                                navigate(`/appointments/${appt.id}`);
                                setOpenMenuId(null);
                              }}
                              className="appt-btn appt-btn-info"
                              title="View"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => {
                                updateStatus(appt.id, "Complete");
                                setOpenMenuId(null);
                              }}
                              className="appt-btn appt-btn-success"
                              title="Mark Complete"
                            >
                              ✓ Complete
                            </button>

                            <button
                              onClick={() => {
                                updateStatus(appt.id, "Cancelled");
                                setOpenMenuId(null);
                              }}
                              className="appt-btn appt-btn-secondary"
                              title="Cancel"
                            >
                              ✕ Cancel
                            </button>
                            <button
                              onClick={() => {
                                handleEdit(appt);
                                setOpenMenuId(null);
                              }}
                              className="appt-btn appt-btn-warning"
                              title="Edit"
                            >
                              ✎ Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(appt.id);
                                setOpenMenuId(null);
                              }}
                              className="appt-btn appt-btn-danger"
                              title="Delete"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile/tablet: Appointment cards */}
              <div className="appt-card-list">
                {currentAppointments.map((appt) => (
                  <div key={appt.id} className="appt-card">
                    <div className="appt-card-row">
                      <strong>Client:</strong> {appt.clientName}
                    </div>
                    <div className="appt-card-row">
                      <strong>Contact:</strong> {appt.clientContact}
                    </div>
                    <div className="appt-card-row">
                      <strong>Service:</strong> {appt.service}
                    </div>
                    <div className="appt-card-row">
                      <strong>Date:</strong> {appt.date}
                    </div>
                    <div className="appt-card-row">
                      <strong>Time:</strong> {appt.time}
                    </div>
                    <div className="appt-card-row">
                      <strong>Fee (Ksh):</strong> {appt.fee}
                    </div>
                    <div className="appt-card-row">
                      <strong>Status:</strong>
                      <span
                        className={`appt-status appt-status-${appt.status.toLowerCase()}`}
                        style={{ marginLeft: "6px" }}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="appt-card-actions">
                      <button
                        onClick={() => updateStatus(appt.id, "Complete")}
                        className="appt-btn appt-btn-success"
                        aria-label="Mark Complete"
                        title="Mark Complete"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => navigate(`/appointments/${appt.id}`)}
                        className="appt-btn appt-btn-info"
                        title="View"
                      >
                        View
                      </button>

                      <button
                        onClick={() => updateStatus(appt.id, "Cancelled")}
                        className="appt-btn appt-btn-secondary"
                        aria-label="Cancel Appointment"
                        title="Cancel"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => handleEdit(appt)}
                        className="appt-btn appt-btn-warning"
                        aria-label={`Edit appointment with ${appt.clientName}`}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="appt-btn appt-btn-danger"
                        aria-label="Delete Appointment"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="appt-pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              title="Previous Page"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
                aria-label={`Go to page ${i + 1}`}
                title={`Go to page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              title="Next Page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentPage;
