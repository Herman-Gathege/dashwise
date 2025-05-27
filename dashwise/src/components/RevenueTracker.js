import React, { useEffect, useState } from "react";
import { fetchAppointments } from "../services/appointmentsService";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import "jspdf-autotable";
import Papa from "papaparse";
import utc from "dayjs/plugin/utc";
import "../styles/RevenueTracker.css";

dayjs.extend(utc);

function RevenueTracker() {
  const [revenueData, setRevenueData] = useState({
    daily: {},
    weekly: {},
    monthly: {},
  });
  const [totals, setTotals] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    averagePerDay: 0,
  });
  const [view, setView] = useState("daily"); // 'daily', 'weekly', 'monthly'

  useEffect(() => {
    fetchAppointments().then((appointments) => {
      const completed = appointments.filter(
        (appt) => appt.status && appt.status.toLowerCase() === "complete"
      );

      const daily = {};
      const weekly = {};
      const monthly = {};

      let today = 0;
      let thisWeek = 0;
      let thisMonth = 0;
      const seenDays = new Set();

      const now = dayjs();

      completed.forEach((appt) => {
        const date = dayjs(appt.date);
        const fee = appt.fee;

        const dayKey = date.format("YYYY-MM-DD");
        const weekKey = date.startOf("week").format("YYYY-[W]WW");
        const monthKey = date.format("YYYY-MM");

        daily[dayKey] = (daily[dayKey] || 0) + fee;
        weekly[weekKey] = (weekly[weekKey] || 0) + fee;
        monthly[monthKey] = (monthly[monthKey] || 0) + fee;

        if (dayKey === now.format("YYYY-MM-DD")) {
          today += fee;
        }

        if (date.startOf("week").isSame(now.startOf("week"))) {
          thisWeek += fee;
        }

        if (monthKey === now.format("YYYY-MM")) {
          thisMonth += fee;
        }

        seenDays.add(dayKey);
      });

      const totalRevenue = completed.reduce((sum, a) => sum + a.fee, 0);
      const averagePerDay =
        seenDays.size > 0 ? totalRevenue / seenDays.size : 0;

      setRevenueData({ daily, weekly, monthly });
      setTotals({ today, thisWeek, thisMonth, averagePerDay });
    });
  }, []);

  const formatChartData = (dataObj) => {
    const labels = Object.keys(dataObj).sort();
    const values = labels.map((key) => dataObj[key]);
    return {
      labels,
      datasets: [
        {
          label: `Revenue (${view})`,
          data: values,
          backgroundColor: "#429ebd",
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#eee",
        },
        ticks: {
          color: "#555",
          font: {
            size: 14,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#555",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#053f5c",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#429ebd",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  const Widget = ({ title, value }) => (
    <div className="revenue-tracker__widget">
      <h4 className="revenue-tracker__widget-title">{title}</h4>
      <p className="revenue-tracker__widget-value">KES {value.toFixed(2)}</p>
    </div>
  );

  const exportToCSV = () => {
    const csvData = Object.entries(revenueData[view]).map(([date, value]) => ({
      Date: date,
      Revenue: value.toFixed(2),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Revenue-${view}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="revenue-tracker">
      <div className="revenue-tracker__export-buttons">
        <button onClick={exportToCSV} className="export-btn">
          Export CSV
        </button>
      </div>
      <h2 className="revenue-tracker__heading">
        Revenue from completed appointments
      </h2>
      

      <div className="revenue-tracker__widgets">
        <Widget title="Today" value={totals.today} />
        <Widget title="This Week" value={totals.thisWeek} />
        <Widget title="This Month" value={totals.thisMonth} />
        <Widget title="Avg/Day" value={totals.averagePerDay} />
      </div>

      <div className="revenue-tracker__view-selector">
        <label htmlFor="view" className="revenue-tracker__view-label">
          View by:
        </label>
        <select
          id="view"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="revenue-tracker__view-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="revenue-tracker__chart">
        <Bar data={formatChartData(revenueData[view])} options={chartOptions} />
      </div>
    </div>
  );
}

export default RevenueTracker;
