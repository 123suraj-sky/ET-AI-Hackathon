// import Login from "../pages/Login/Login";

// import Register from "../pages/Register/Register";

// import Copilot from "../pages/Copilot/Copilot";

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import MainLayout from "../layouts/MainLayout";

// import Dashboard from "../pages/Dashboard/Dashboard";
// import Forecast from "../pages/Forecast/Forecast";
// import SourceAnalysis from "../pages/SourceAnalysis/SourceAnalysis";
// import Recommendations from "../pages/Recommendations/Recommendations";
// import CitizenHealth from "../pages/CitizenHealth/CitizenHealth";
// import Reports from "../pages/Reports/Reports";

// function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />}
//          />

//          <Route path="/register" element={<Register />}
//           />

//           <Route
//           path="/copilot"
//           element={
//             <MainLayout>
//               <Copilot />
//             </MainLayout>
//           }
//         />

        
//         <Route
//           path="/"
//           element={
//             <MainLayout>
//               <Dashboard />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/forecast"
//           element={
//             <MainLayout>
//               <Forecast />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/source-analysis"
//           element={
//             <MainLayout>
//               <SourceAnalysis />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/recommendations"
//           element={
//             <MainLayout>
//               <Recommendations />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/citizen-health"
//           element={
//             <MainLayout>
//               <CitizenHealth />
//             </MainLayout>
//           }
//         />

//         <Route
//           path="/reports"
//           element={
//             <MainLayout>
//               <Reports />
//             </MainLayout>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import Forecast from "../pages/Forecast/Forecast";
import SourceAnalysis from "../pages/SourceAnalysis/SourceAnalysis";
import Recommendations from "../pages/Recommendations/Recommendations";
import CitizenHealth from "../pages/CitizenHealth/CitizenHealth";
import Reports from "../pages/Reports/Reports";
import Copilot from "../pages/Copilot/Copilot";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Forecast */}
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Forecast />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Source Analysis */}
        <Route
          path="/source-analysis"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SourceAnalysis />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Recommendations */}
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Recommendations />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Citizen Health */}
        <Route
          path="/citizen-health"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CitizenHealth />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected AI Copilot */}
        <Route
          path="/copilot"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Copilot />
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;