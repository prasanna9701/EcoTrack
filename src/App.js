// import React from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { SidebarProvider } from "./pages/SidebarContext";
// import Sidebar from "./pages/sidebar";
// import Login from "./pages/login";
// import Home from "./pages/home";
// import Emission from "./pages/emission";
// import Energy from "./pages/energy";
// import Reports from "./pages/reports";
// import Purchase from "./pages/purchase";
// import LandingPage from "./pages/landingpage";
// import ProtectedRoute from "./pages/ProtectedRoute";
// function AppRoutes() {
//   const location = useLocation();
//   const noSidebarRoutes = new Set(["/", "/login", "/signup"]);
//   const isAuthRoute = noSidebarRoutes.has(location.pathname);

//   return (
//     <div style={{ display: "flex" }}>
//       {!isAuthRoute && <Sidebar />}
//       <div style={{ flex: 1 }}>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/emission" element={<Emission />} />
//           <Route path="/energy" element={<Energy />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/purchase" element={<Purchase />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <SidebarProvider>
//       <Router>
//         <AppRoutes />
//       </Router>
//     </SidebarProvider>
//   );
// }

// export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { SidebarProvider } from "./pages/SidebarContext";
import Sidebar from "./pages/sidebar";
import Login from "./pages/login";
import Home from "./pages/home";
import Emission from "./pages/emission";
import Energy from "./pages/energy";
import Reports from "./pages/reports";
import Purchase from "./pages/purchase";
import LandingPage from "./pages/landingpage";
import ProtectedRoute from "./pages/ProtectedRoute";

function AppRoutes() {
  const location = useLocation();

  /*
    ROUTES WHERE SIDEBAR SHOULD NOT APPEAR
  */
  const noSidebarRoutes = new Set([
    "/",
    "/login",
    "/signup",
  ]);

  const isAuthRoute = noSidebarRoutes.has(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {/* SHOW SIDEBAR ONLY AFTER LOGIN */}
      {!isAuthRoute && <Sidebar />}

      <div style={{ flex: 1 }}>
        <Routes>

          {/* PUBLIC ROUTES */}

          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />

          {/* PROTECTED ROUTES */}

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/emission"
            element={
              <ProtectedRoute>
                <Emission />
              </ProtectedRoute>
            }
          />

          <Route
            path="/energy"
            element={
              <ProtectedRoute>
                <Energy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <Purchase />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SidebarProvider>
  );
}

export default App;