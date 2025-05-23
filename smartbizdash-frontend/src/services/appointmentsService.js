// src/services/appointmentsService.js
const API_URL = "http://localhost:5000/appointments";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function fetchAppointments() {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function saveAppointment(formData, editingId = null) {
  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${API_URL}/${editingId}` : API_URL;

  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to save appointment");
  return res.json();
}

export async function deleteAppointment(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete appointment");
  return res.json();
}

export async function updateAppointmentStatus(id, status) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}
