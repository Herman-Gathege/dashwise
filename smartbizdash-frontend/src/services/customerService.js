const API_URL = "http://localhost:5000/customers";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function fetchCustomers() {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function deleteCustomer(clientName, clientContact) {
  const res = await fetch("http://localhost:5000/customers", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ clientName, clientContact }),
  });

  if (!res.ok) throw new Error("Failed to delete customer");
  return res.json();
}

export async function editCustomer(oldClientName, oldClientContact, newClientName, newClientContact) {
  const res = await fetch("http://localhost:5000/customers/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ oldClientName, oldClientContact, newClientName, newClientContact }),
  });

  if (!res.ok) throw new Error("Failed to edit customer");
  return res.json();
}
