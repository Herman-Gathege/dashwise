import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import AppointmentDetails from "./components/AppointmentDetails";
import PublicNav from "./components/PublicNav";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import About from "./components/About";

function AppContent() {
  const location = useLocation();

  // Hide footer for these paths
  const hideFooter =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/appointments");

  return (
    <>
      <Routes>
        {/* Public routes WITH PublicNav */}
        <Route
          path="/"
          element={
            <>
              <PublicNav />
              <Home />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <PublicNav />
              <Contact />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <PublicNav />
              <About />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PublicNav />
              <Login />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <PublicNav />
              <Signup />
            </>
          }
        />

        {/* Protected routes WITHOUT PublicNav */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <PrivateRoute>
              <AppointmentDetails />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Conditionally render footer */}
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
