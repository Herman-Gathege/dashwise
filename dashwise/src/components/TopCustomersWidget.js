import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/fetchWithAuth';
import "../styles/Dashboard.css";

const TopCustomersWidget = () => {
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchWithAuth("http://localhost:5000/top-customers");
      if (res.ok) {
        const data = await res.json();
        setTopCustomers(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="styled-widget">
      <h3>Top Customers</h3>
      {topCustomers.map((cust, idx) => (
        <div className="item" key={idx}>
          <div className="left">
            {cust.clientName} – {cust.visits} visits
          </div>
          <div className="right">KES {cust.totalPaid}</div>
        </div>
      ))}
    </div>
  );
};

export default TopCustomersWidget;
