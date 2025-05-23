// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import Home from './components/Home';
// import PrivateRoute from './components/PrivateRoute';
// import AppointmentDetails from './components/AppointmentDetails';
// import PublicNav from './components/PublicNav'; // 👈

// function App() {
//   return (
//     <Router>
//       <PublicNav /> {/* 👈 Add here */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
        
//         <Route 
//           path="/dashboard" 
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/appointments/:id" 
//           element={
//             <PrivateRoute>
//               <AppointmentDetails />
//             </PrivateRoute>
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import AppointmentDetails from './components/AppointmentDetails';
import PublicNav from './components/PublicNav'; // 👈

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
