
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaLeaf, FaBolt, FaFileAlt,FaShoppingCart} from "react-icons/fa";
import { useSidebar } from "./SidebarContext"; // Make sure you have SidebarContext.js

// Navigation items with icons
const navItems = [
  { name: "Dashboard", path: "/home", icon: <FaHome /> },
  { name: "Emissions", path: "/emission", icon: <FaLeaf /> },
  { name: "Energy", path: "/energy", icon: <FaBolt /> },
  { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
  {name:"Purchase",path:"/purchase",icon: <FaShoppingCart />},
];

const Sidebar = () => {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();

  const toggleSidebar = () => setSidebarCollapsed((v) => !v);

  return (
    <aside
      style={{
        width: sidebarCollapsed ? "64px" : "240px",
        transition: "width 0.3s ease",
        backgroundColor: "#f8fafc",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        position: "relative",
      }}
    >
      {/* Logo Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "10px",
            background: "conic-gradient(from 140deg, #22c55e, #16a34a, #4ade80)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#022c22",
            fontWeight: 700,
          }}
        >
          E
        </div>
        <span
          style={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            transition: "opacity 0.3s, width 0.3s",
            opacity: sidebarCollapsed ? 0 : 1,
            width: sidebarCollapsed ? 0 : "auto",
            color: "#0f172a",
          }}
        >
          EcoTrack
        </span>

        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            marginLeft: "auto",
            border: "none",
            background: "transparent",
            color: "#64748b",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {sidebarCollapsed ? "❯" : "❮"}
        </button>
      </div>

      {/* Navigation */}
      <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <li key={item.path} style={{ margin: "8px 0" }}>
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: active ? "#166534" : "#334155",
                  backgroundColor: active ? "#dcfce7" : "transparent",
                  transition: "background-color 0.2s, color 0.2s",
                }}
                title={sidebarCollapsed ? item.name : ""}
              >
                {item.icon}
                {!sidebarCollapsed && item.name}
              </Link>
            </li>
          );
        })}
      </ul>

    </aside>
  );
};

export default Sidebar;