import React, { useState } from "react";
import { fetchWithAuth } from "../services/fetchWithAuth";

function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    setLoading(true);
    const res = await fetchWithAuth("http://localhost:5000/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.message || data.error);
  };

  return (
    <div className="appt-container">
      <form className="appt-form">
        <div className="form-head">Change Password</div>

        <div>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            className="appt-input"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            className="appt-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <button
          type="button"
          className="appt-btn-submit"
          onClick={handlePasswordChange}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p style={{ gridColumn: "1/-1", color: message.includes("success") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default SettingsPage;
