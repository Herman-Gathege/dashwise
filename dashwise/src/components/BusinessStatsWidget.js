import React, { useEffect, useState } from "react";
import { fetchAppointments } from "../services/appointmentsService";
import dayjs from "dayjs";
import { FaMoneyBillWave, FaUsers } from "react-icons/fa";

function BusinessStatsWidget() {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    fetchAppointments().then((appointments) => {
      const completed = appointments.filter(
        (appt) => appt.status?.toLowerCase() === "complete"
      );

      const nowMonth = dayjs().format("YYYY-MM");

      const monthEarnings = completed
        .filter((appt) => dayjs(appt.date).format("YYYY-MM") === nowMonth)
        .reduce((sum, appt) => sum + appt.fee, 0);

      const customers = new Set(
        completed.map((appt) => appt.clientName.trim().toLowerCase())
      );

      setMonthlyTotal(monthEarnings);
      setCustomerCount(customers.size);
    });
  }, []);

  return (
    <>
      <div className="widget-card completed-widget">
        <div className="widget-header">
          <h4>Total Earnings</h4>
          <FaMoneyBillWave className="widget-icon" />
        </div>
        <div className="count">KES {monthlyTotal.toFixed(2)}</div>
        <h6>Within current month</h6>
      </div>

      <div className="widget-card completed-widget">
        <div className="widget-header">
          <h4>Customer Count</h4>
          <FaUsers className="widget-icon" />
        </div>
        <div className="count">{customerCount}</div>
        <h6>All Customers served</h6>
      </div>
    </>
  );
}

export default BusinessStatsWidget;
