import React, { useEffect, useState, useCallback } from "react";
import "../styles/AppointmentPage.css";

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
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const token = localStorage.getItem("token");

  // Filter appointments by search term
  const filteredAppointments = appointments.filter((appt) =>
    appt.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastAppt = currentPage * appointmentsPerPage;
  const indexOfFirstAppt = indexOfLastAppt - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppt,
    indexOfLastAppt
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const fetchAppointments = useCallback(async () => {
    console.log("Fetching appointments...");
    try {
      const res = await fetch("http://localhost:5000/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

      const data = await res.json();
      console.log("Appointments fetched:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      editingId
        ? `Updating appointment id=${editingId}`
        : "Adding new appointment"
    );
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/appointments/${editingId}`
      : "http://localhost:5000/appointments";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingId ? "Appointment updated!" : "Appointment added!");
        console.log(
          editingId
            ? "Appointment updated successfully"
            : "Appointment added successfully"
        );
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
        fetchAppointments();
      } else {
        console.error("Failed to save appointment, status:", res.status);
        alert("Failed to save appointment.");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment due to an error.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    console.log(`Deleting appointment id=${id}...`);
    try {
      const res = await fetch(`http://localhost:5000/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Appointment deleted!");
        console.log("Appointment deleted successfully");
        fetchAppointments();
      } else {
        console.error("Failed to delete appointment, status:", res.status);
        alert("Failed to delete appointment.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment due to an error.");
    }
  };

  const handleEdit = (appointment) => {
    console.log("Editing appointment:", appointment);
    setFormData({
      clientName: appointment.clientName,
      clientContact: appointment.clientContact,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      fee: appointment.fee,
      status: appointment.status || "Scheduled", // Keep status in form data
    });
    setEditingId(appointment.id);
  };

  const updateStatus = async (id, newStatus) => {
    console.log(`Updating status for appointment id=${id} to "${newStatus}"`);
    try {
      const res = await fetch(`http://localhost:5000/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        console.log("Status updated successfully");
        fetchAppointments();
      } else {
        console.error("Failed to update status, status:", res.status);
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status due to an error.");
    }
  };

  return (
    <div className="container mt-4">
      <h4>{editingId ? "Edit Appointment" : "Add Appointment"}</h4>
      <form onSubmit={handleSubmit} className="appt-form row g-3">
        <div className="col-md-6">
          <input
            name="clientName"
            placeholder="Client Name"
            value={formData.clientName}
            onChange={handleChange}
            className="form-control appt-input"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            name="clientContact"
            placeholder="Client Contact"
            value={formData.clientContact}
            onChange={handleChange}
            className="form-control appt-input"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            name="service"
            placeholder="Service"
            value={formData.service}
            onChange={handleChange}
            className="form-control appt-input"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control appt-input"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="form-control appt-input"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            name="fee"
            placeholder="Fee"
            value={formData.fee}
            onChange={handleChange}
            className="form-control appt-input"
            required
          />
        </div>
        <div className="col-md-6">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control appt-select"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary appt-btn-submit">
            {editingId ? "Update Appointment" : "Add Appointment"}
          </button>
        </div>
      </form>

      <hr />
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h5 className="mt-4">Your Appointments</h5>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table className="table table-striped mt-2 appt-table">
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
                <td className="appt-actions">
                  <button
                    onClick={() => updateStatus(appt.id, "Complete")}
                    className="btn btn-sm btn-success me-2 appt-btn"
                    title="Mark Complete"
                  >
                    ✓ Complete
                  </button>
                  <button
                    onClick={() => updateStatus(appt.id, "Cancelled")}
                    className="btn btn-sm btn-secondary me-2 appt-btn"
                    title="Cancel"
                  >
                    ✕ Cancelled
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-2 appt-btn"
                    onClick={() => handleEdit(appt)}
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    className="btn btn-sm btn-danger appt-btn"
                    onClick={() => handleDelete(appt.id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <nav>
        <ul className="pagination justify-content-center mt-3">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AppointmentPage;
