import { useEffect, useState } from "react";
import {
  fetchCustomers,
  deleteCustomer,
  editCustomer,
} from "../services/customerService";

import "../styles/Customer.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const filtered = customers.filter(
    (c) =>
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.clientContact.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedCustomers = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(console.error);
  }, []);

  const handleDelete = async (name, contact) => {
    try {
      await deleteCustomer(name, contact);
      // Refresh customer list after delete
      const updated = await fetchCustomers();
      setCustomers(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setNewName(c.clientName);
    setNewContact(c.clientContact);
  };

  const submitEdit = async () => {
    try {
      await editCustomer(
        editing.clientName,
        editing.clientContact,
        newName,
        newContact
      );
      const updated = await fetchCustomers();
      setCustomers(updated);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // <div className="cust-container">
    //   <input
    //     className="cust-search"
    //     placeholder="Search by name or contact"
    //     value={search}
    //     onChange={(e) => setSearch(e.target.value)}
    //   />

    //   <table className="cust-table">
    //     <thead>
    //       <tr>
    //         <th>Name</th>
    //         <th>Contact</th>
    //         <th>Total Appointments</th>
    //         <th>Completed</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {filtered.map((c, i) => (
    //         <tr key={i}>
    //           {editing?.clientContact === c.clientContact ? (
    //             <>
    //               <td>
    //                 <input
    //                   className="cust-input"
    //                   value={newName}
    //                   onChange={(e) => setNewName(e.target.value)}
    //                 />
    //               </td>
    //               <td>
    //                 <input
    //                   className="cust-input"
    //                   value={newContact}
    //                   onChange={(e) => setNewContact(e.target.value)}
    //                 />
    //               </td>
    //               <td colSpan="3">
    //                 <button className="cust-btn" onClick={submitEdit}>Save</button>
    //                 <button className="cust-btn" onClick={() => setEditing(null)}>Cancel</button>
    //               </td>
    //             </>
    //           ) : (
    //             <>
    //               <td>{c.clientName}</td>
    //               <td>{c.clientContact}</td>
    //               <td>{c.totalAppointments}</td>
    //               <td>{c.completedAppointments}</td>
    //               <td className="cust-actions">
    //                 <button className="cust-btn" onClick={() => handleEdit(c)}>Edit</button>
    //                 <button
    //                   className="cust-btn"
    //                   onClick={() =>
    //                     handleDelete(c.clientName, c.clientContact)
    //                   }
    //                 >
    //                   Delete
    //                 </button>
    //               </td>
    //             </>
    //           )}
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
    <div className="cust-container">
      <input
        className="cust-search"
        placeholder="Search by name or contact"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to page 1 on new search
        }}
      />

      <table className="cust-table">
        <thead>
          <tr>
            <th data-label="Name">Name</th>
            <th data-label="Contact">Contact</th>
            <th data-label="Total Appointments">Total Appointments</th>
            <th data-label="Completed">Completed</th>
            <th data-label="Actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((c, i) => (
            <tr key={i}>
              {editing?.clientContact === c.clientContact ? (
                <>
                  <td>
                    <input
                      className="cust-input"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cust-input"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                    />
                  </td>
                  <td colSpan="3">
                    <button className="cust-btn" onClick={submitEdit}>
                      Save
                    </button>
                    <button
                      className="cust-btn"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{c.clientName}</td>
                  <td>{c.clientContact}</td>
                  <td>{c.totalAppointments}</td>
                  <td>{c.completedAppointments}</td>
                  <td className="cust-actions">
                    <button className="cust-btn" onClick={() => handleEdit(c)}>
                      Edit
                    </button>
                    <button
                      className="cust-btn"
                      onClick={() =>
                        handleDelete(c.clientName, c.clientContact)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cust-pagination">
  <button
    className="cust-btn"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    aria-label="Previous Page"
    title="Previous Page"
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      className={`cust-btn ${currentPage === i + 1 ? "active" : ""}`}
      onClick={() => setCurrentPage(i + 1)}
      aria-label={`Go to page ${i + 1}`}
      title={`Go to page ${i + 1}`}
      disabled={currentPage === i + 1}
    >
      {i + 1}
    </button>
  ))}

  <button
    className="cust-btn"
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
  );
}
