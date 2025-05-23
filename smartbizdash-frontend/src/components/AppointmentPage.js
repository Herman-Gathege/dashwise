// import React, { useEffect, useState, useCallback } from "react";
// import "../styles/AppointmentPage.css";

// function AppointmentPage() {
//   const [formData, setFormData] = useState({
//     clientName: "",
//     clientContact: "",
//     service: "",
//     date: "",
//     time: "",
//     fee: "",
//     status: "Scheduled",
//   });
//   const [appointments, setAppointments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const appointmentsPerPage = 10;

//   const token = localStorage.getItem("token");

//   // Filter appointments by search term
//   const filteredAppointments = appointments.filter((appt) =>
//     appt.clientName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastAppt = currentPage * appointmentsPerPage;
//   const indexOfFirstAppt = indexOfLastAppt - appointmentsPerPage;
//   const currentAppointments = filteredAppointments.slice(
//     indexOfFirstAppt,
//     indexOfLastAppt
//   );

//   const totalPages = Math.ceil(
//     filteredAppointments.length / appointmentsPerPage
//   );

//   const fetchAppointments = useCallback(async () => {
//     console.log("Fetching appointments...");
//     try {
//       const res = await fetch("http://localhost:5000/appointments", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

//       const data = await res.json();
//       console.log("Appointments fetched:", data);
//       setAppointments(data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchAppointments();
//   }, [fetchAppointments]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log(`Form field changed: ${name} = ${value}`);
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(
//       editingId
//         ? `Updating appointment id=${editingId}`
//         : "Adding new appointment"
//     );
//     const method = editingId ? "PUT" : "POST";
//     const url = editingId
//       ? `http://localhost:5000/appointments/${editingId}`
//       : "http://localhost:5000/appointments";

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         alert(editingId ? "Appointment updated!" : "Appointment added!");
//         console.log(
//           editingId
//             ? "Appointment updated successfully"
//             : "Appointment added successfully"
//         );
//         setFormData({
//           clientName: "",
//           clientContact: "",
//           service: "",
//           date: "",
//           time: "",
//           fee: "",
//           status: "Scheduled",
//         });
//         setEditingId(null);
//         fetchAppointments();
//       } else {
//         console.error("Failed to save appointment, status:", res.status);
//         alert("Failed to save appointment.");
//       }
//     } catch (error) {
//       console.error("Error saving appointment:", error);
//       alert("Failed to save appointment due to an error.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this appointment?"))
//       return;

//     console.log(`Deleting appointment id=${id}...`);
//     try {
//       const res = await fetch(`http://localhost:5000/appointments/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         alert("Appointment deleted!");
//         console.log("Appointment deleted successfully");
//         fetchAppointments();
//       } else {
//         console.error("Failed to delete appointment, status:", res.status);
//         alert("Failed to delete appointment.");
//       }
//     } catch (error) {
//       console.error("Error deleting appointment:", error);
//       alert("Failed to delete appointment due to an error.");
//     }
//   };

//   const handleEdit = (appointment) => {
//     console.log("Editing appointment:", appointment);
//     setFormData({
//       clientName: appointment.clientName,
//       clientContact: appointment.clientContact,
//       service: appointment.service,
//       date: appointment.date,
//       time: appointment.time,
//       fee: appointment.fee,
//       status: appointment.status || "Scheduled", // Keep status in form data
//     });
//     setEditingId(appointment.id);
//   };

//   const updateStatus = async (id, newStatus) => {
//     console.log(`Updating status for appointment id=${id} to "${newStatus}"`);
//     try {
//       const res = await fetch(`http://localhost:5000/appointments/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         console.log("Status updated successfully");
//         fetchAppointments();
//       } else {
//         console.error("Failed to update status, status:", res.status);
//         alert("Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Failed to update status due to an error.");
//     }
//   };

//   return (
//     <div className="appt-container container mt-4">
//       <div className="container mt-4">
//         <h4 className="form-head">{editingId ? "Edit Appointment" : "Add Appointment"}</h4>
//         <form onSubmit={handleSubmit} className="appt-form row g-3">
//           <div className="col-md-6">
//             <input
//               name="clientName"
//               placeholder="Client Name"
//               value={formData.clientName}
//               onChange={handleChange}
//               className="form-control appt-input"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <input
//               name="clientContact"
//               placeholder="Client Contact"
//               value={formData.clientContact}
//               onChange={handleChange}
//               className="form-control appt-input"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <input
//               name="service"
//               placeholder="Service"
//               value={formData.service}
//               onChange={handleChange}
//               className="form-control appt-input"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="form-control appt-input"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <input
//               type="time"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//               className="form-control appt-input"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <input
//               name="fee"
//               placeholder="Fee"
//               value={formData.fee}
//               onChange={handleChange}
//               className="form-control appt-input"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="form-control appt-select"
//             >
//               <option value="Scheduled">Scheduled</option>
//               <option value="Complete">Complete</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>

//           <div className="col-12 text-end">
//             <button type="submit" className="btn btn-primary appt-btn-submit">
//               {editingId ? "Update Appointment" : "Add Appointment"}
//             </button>
//           </div>
//         </form>

//         <hr />
//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by client name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <h5 className="mt-4">Your Appointments</h5>
//         {appointments.length === 0 ? (
//           <p>No appointments yet.</p>
//         ) : (
//           <table className="table table-striped mt-2 appt-table">
//             <thead>
//               <tr>
//                 <th>Client</th>
//                 <th>Contact</th>
//                 <th>Service</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Fee (Ksh)</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentAppointments.map((appt) => (
//                 <tr key={appt.id} className="appt-row">
//                   <td>{appt.clientName}</td>
//                   <td>{appt.clientContact}</td>
//                   <td>{appt.service}</td>
//                   <td>{appt.date}</td>
//                   <td>{appt.time}</td>
//                   <td>{appt.fee}</td>
//                   <td>
//                     <strong
//                       className={`appt-status appt-status-${appt.status.toLowerCase()}`}
//                     >
//                       {appt.status}
//                     </strong>
//                   </td>
//                   <td className="appt-actions">
//                     <button
//                       onClick={() => updateStatus(appt.id, "Complete")}
//                       className="btn btn-sm btn-success me-2 appt-btn"
//                       title="Mark Complete"
//                     >
//                       ✓ Complete
//                     </button>
//                     <button
//                       onClick={() => updateStatus(appt.id, "Cancelled")}
//                       className="btn btn-sm btn-secondary me-2 appt-btn"
//                       title="Cancel"
//                     >
//                       ✕ Cancelled
//                     </button>

//                     <button
//                       className="btn btn-sm btn-warning me-2 appt-btn"
//                       onClick={() => handleEdit(appt)}
//                       title="Edit"
//                     >
//                       ✎
//                     </button>
//                     <button
//                       className="btn btn-sm btn-danger appt-btn"
//                       onClick={() => handleDelete(appt.id)}
//                       title="Delete"
//                     >
//                       🗑
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         <nav>
//           <ul className="pagination justify-content-center mt-3">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage((prev) => prev - 1)}
//               >
//                 Previous
//               </button>
//             </li>
//             {[...Array(totalPages)].map((_, i) => (
//               <li
//                 key={i}
//                 className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
//               >
//                 <button
//                   className="page-link"
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               </li>
//             ))}
//             <li
//               className={`page-item ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// }

// export default AppointmentPage;

import React, { useEffect, useState, useCallback } from "react";

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

  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <h5>Your Appointments</h5>

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
                      <td className="appt-actions">
                        <button
                          onClick={() => updateStatus(appt.id, "Complete")}
                          className="appt-btn appt-btn-success"
                          aria-label={`Mark appointment with ${appt.clientName} complete`}
                          title="Complete"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => navigate(`/appointments/${appt.id}`)}
                          className="appt-btn appt-btn-info"
                          aria-label={`View appointment with ${appt.clientName}`}
                          title="View"
                        >
                          View
                        </button>
                        <button
                          onClick={() => updateStatus(appt.id, "Cancelled")}
                          className="appt-btn appt-btn-secondary"
                          aria-label={`Cancel appointment with ${appt.clientName}`}
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
                          aria-label={`Delete appointment with ${appt.clientName}`}
                          title="Delete"
                        >
                          🗑
                        </button>
                      </td>
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
