import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const COLORS = {
  primary: "#0ea5e9", primaryDark: "#0284c7", accent: "#06b6d4",
  success: "#22c55e", warning: "#f59e0b", danger: "#ef4444",
  purple: "#8b5cf6", bg: "#0f172a", surface: "#1e293b",
  surfaceHigh: "#334155", border: "#334155", text: "#f1f5f9", textMuted: "#94a3b8",
};

const VEHICLES = [
  { id: "VH-001", name: "Tesla Model 3", type: "EV",     status: "Available",   battery: 87, location: "Zone A", trips: 142 },
  { id: "VH-002", name: "Toyota Camry",  type: "Petrol", status: "In Use",      battery: 62, location: "Zone B", trips: 89  },
  { id: "VH-003", name: "Nissan Leaf",   type: "EV",     status: "Maintenance", battery: 23, location: "Depot",  trips: 201 },
  { id: "VH-004", name: "Honda City",    type: "Petrol", status: "Available",   battery: 91, location: "Zone C", trips: 67  },
  { id: "VH-005", name: "BMW i3",        type: "EV",     status: "In Use",      battery: 54, location: "Zone A", trips: 178 },
  { id: "VH-006", name: "Maruti Swift",  type: "Petrol", status: "Available",   battery: 78, location: "Zone D", trips: 44  },
];

const MAINTENANCE_ALERTS = [
  { id: "VH-003", vehicle: "Nissan Leaf",  issue: "Battery degradation", severity: "Critical", action: "Replace battery cells",  due: "Immediate" },
  { id: "VH-002", vehicle: "Toyota Camry", issue: "Brake pad wear",      severity: "Warning",  action: "Schedule brake service", due: "3 days"    },
  { id: "VH-005", vehicle: "BMW i3",       issue: "Tyre pressure low",   severity: "Warning",  action: "Inflate tyres",          due: "Today"     },
  { id: "VH-006", vehicle: "Maruti Swift", issue: "Oil change due",      severity: "Info",     action: "Schedule oil service",   due: "7 days"    },
];

const HEALTH_DATA = [
  { month: "Oct", battery: 92, tyres: 88, engine: 95, brakes: 90 },
  { month: "Nov", battery: 88, tyres: 85, engine: 93, brakes: 88 },
  { month: "Dec", battery: 84, tyres: 80, engine: 91, brakes: 82 },
  { month: "Jan", battery: 79, tyres: 76, engine: 89, brakes: 78 },
  { month: "Feb", battery: 72, tyres: 70, engine: 87, brakes: 72 },
  { month: "Mar", battery: 65, tyres: 64, engine: 84, brakes: 66 },
];

const MAINTENANCE_PIE = [
  { name: "Healthy",  value: 3, color: COLORS.success },
  { name: "Due Soon", value: 2, color: COLORS.warning },
  { name: "Critical", value: 1, color: COLORS.danger  },
];

const BOOKING_VEHICLES = [
  { id: "VH-001", name: "Tesla Model 3", type: "EV",     seats: 5, pricePerHr: 180, rating: 4.8, recommended: true,  features: ["Autopilot","Heated Seats","Wi-Fi"] },
  { id: "VH-004", name: "Honda City",    type: "Petrol", seats: 5, pricePerHr: 120, rating: 4.5, recommended: false, features: ["Sunroof","Bluetooth","USB-C"]      },
  { id: "VH-006", name: "Maruti Swift",  type: "Petrol", seats: 5, pricePerHr: 85,  rating: 4.2, recommended: false, features: ["Bluetooth","AC","Cruise"]          },
];

const HOURLY_ACTIVITY = [
  { hr: "6AM", rentals: 3  }, { hr: "8AM",  rentals: 12 }, { hr: "10AM", rentals: 9  },
  { hr: "12PM", rentals: 15 }, { hr: "2PM", rentals: 11 }, { hr: "4PM",  rentals: 18 },
  { hr: "6PM", rentals: 22 }, { hr: "8PM",  rentals: 14 }, { hr: "10PM", rentals: 6  },
];

const TRIP_DENSITY = [
  { zone: "Zone A", trips: 142, pct: 34 }, { zone: "Zone B", trips: 98, pct: 24 },
  { zone: "Zone C", trips: 76,  pct: 18 }, { zone: "Zone D", trips: 58, pct: 14 },
  { zone: "Depot",  trips: 43,  pct: 10 },
];

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    Available:   { bg: "#052e16", color: "#4ade80" },
    "In Use":    { bg: "#1e3a5f", color: "#60a5fa" },
    Maintenance: { bg: "#431407", color: "#fb923c" },
    Critical:    { bg: "#450a0a", color: "#f87171" },
    Warning:     { bg: "#422006", color: "#fbbf24" },
    Info:        { bg: "#0c1a2e", color: "#93c5fd" },
  };
  const s = map[status] || { bg: "#1e293b", color: "#94a3b8" };
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 20, border: `1px solid ${s.color}33`,
    }}>{status}</span>
  );
};

const StatCard = ({ label, value, sub, color = COLORS.primary, icon }) => (
  <div style={{
    background: COLORS.surface, borderRadius: 14, padding: "20px 22px",
    border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 150,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: color, fontSize: 12, marginTop: 5 }}>{sub}</div>}
      </div>
      {icon && <div style={{ fontSize: 22, opacity: 0.6 }}>{icon}</div>}
    </div>
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
    {sub && <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>{sub}</p>}
  </div>
);

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",   label: "Admin Dashboard",      icon: "▦"  },
  { id: "fleet",       label: "Fleet Inventory",       icon: "🚗" },
  { id: "routes",      label: "Route Optimization",    icon: "🗺" },
  { id: "maintenance", label: "Maintenance Analytics", icon: "🔧" },
  { id: "bookings",    label: "Booking & AI Recs",     icon: "📅" },
];

const Sidebar = ({ active, onNav, role, onLogout }) => (
  <div style={{
    width: 240, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`,
    display: "flex", flexDirection: "column", padding: "24px 0",
    flexShrink: 0, height: "100vh", position: "sticky", top: 0,
  }}>
    <div style={{ padding: "0 24px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, fontSize: 16,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.purple})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>⚡</div>
        <div>
          <div style={{ color: COLORS.text, fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>NeuroFleetX</div>
          <div style={{ color: COLORS.textMuted, fontSize: 11 }}>Urban Mobility AI</div>
        </div>
      </div>
    </div>

    <div style={{ padding: "0 24px 20px" }}>
      <div style={{ background: "#1a2744", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, fontSize: 12,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {role === "Admin" ? "👑" : role === "Fleet Manager" ? "🧭" : "👤"}
        </div>
        <div>
          <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 600 }}>{role}</div>
          <div style={{ color: COLORS.textMuted, fontSize: 10 }}>Logged in</div>
        </div>
      </div>
    </div>

    <nav style={{ flex: 1, padding: "0 12px" }}>
      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={() => onNav(item.id)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
          marginBottom: 3, textAlign: "left", fontSize: 13,
          background: active === item.id ? `${COLORS.primary}20` : "transparent",
          color: active === item.id ? COLORS.primary : COLORS.textMuted,
          fontWeight: active === item.id ? 600 : 400,
          borderLeft: active === item.id ? `2px solid ${COLORS.primary}` : "2px solid transparent",
        }}>
          <span style={{ fontSize: 15 }}>{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>

    <div style={{ padding: "16px 24px 0", borderTop: `1px solid ${COLORS.border}` }}>
      <button onClick={onLogout} style={{
        width: "100%", background: "transparent", color: COLORS.textMuted,
        border: `1px solid ${COLORS.border}`, borderRadius: 8,
        padding: "8px 0", fontSize: 12, cursor: "pointer",
      }}>Logout</button>
      <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 10 }}>v1.0 • Infosys Springboard</div>
    </div>
  </div>
);

// ── LOGIN ──────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("admin@neurofleetx.ai");
  const [pass, setPass] = useState("");

  const inputStyle = {
    width: "100%", background: "#0f172a", color: COLORS.text,
    border: `1px solid ${COLORS.border}`, borderRadius: 10,
    padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 24 }}>
        <div style={{
          background: COLORS.surface, borderRadius: 20, padding: 40,
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, fontSize: 26,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>⚡</div>
            <h1 style={{ color: COLORS.text, fontSize: 22, fontWeight: 800, margin: 0 }}>NeuroFleetX</h1>
            <p style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>AI-Driven Urban Mobility Platform</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>ROLE</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                <option>Admin</option>
                <option>Fleet Manager</option>
                <option>Driver</option>
                <option>Customer</option>
              </select>
            </div>
            <div>
              <label style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>PASSWORD</label>
              <input type="password" placeholder="Enter password" value={pass} onChange={e => setPass(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={() => onLogin(role)} style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              color: "#fff", border: "none", borderRadius: 10, padding: "12px 0",
              fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4,
            }}>Sign In →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ADMIN DASHBOARD ────────────────────────────────────────────────────────────
const AdminDashboard = () => (
  <div>
    <SectionHeader title="Admin Dashboard" sub="Real-time fleet intelligence & urban mobility insights" />
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
      <StatCard label="Total Fleet"     value="48"     sub="+3 this month"       color={COLORS.success} icon="🚗" />
      <StatCard label="Active Routes"   value="17"     sub="Live tracking"        color={COLORS.primary} icon="📍" />
      <StatCard label="Trips Today"     value="134"    sub="↑ 18% vs yesterday"   color={COLORS.accent}  icon="🔄" />
      <StatCard label="Avg Travel Time" value="24 min" sub="KPI: reduce congestion" color={COLORS.warning} icon="⏱" />
      <StatCard label="Revenue Today"   value="₹38.4K" sub="Target: ₹45K"         color={COLORS.purple}  icon="💰" />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 18, fontSize: 14 }}>Hourly Rental Activity</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={HOURLY_ACTIVITY}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="hr" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
            <Bar dataKey="rentals" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 18, fontSize: 14 }}>Trip Density by Zone</div>
        {TRIP_DENSITY.map(z => (
          <div key={z.zone} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: COLORS.textMuted }}>{z.zone}</span>
              <span style={{ color: COLORS.text, fontWeight: 600 }}>{z.trips} trips ({z.pct}%)</span>
            </div>
            <div style={{ height: 8, background: COLORS.bg, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4, width: `${z.pct * 3}%`,
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 18, fontSize: 14 }}>Fleet Health Status</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={MAINTENANCE_PIE} cx={65} cy={65} innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                {MAINTENANCE_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            {MAINTENANCE_PIE.map(p => (
              <div key={p.name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
                  <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{p.name}</span>
                </div>
                <span style={{ color: COLORS.text, fontWeight: 600, fontSize: 13 }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 18, fontSize: 14 }}>Reports & Export</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Fleet Status Report (CSV)", "Trip Analytics (PDF)", "Maintenance Log (CSV)", "Revenue Summary (PDF)"].map(r => (
            <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg, borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ color: COLORS.textMuted, fontSize: 13 }}>📄 {r}</span>
              <button style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── FLEET INVENTORY ────────────────────────────────────────────────────────────
const FleetInventory = () => {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Available", "In Use", "Maintenance"];
  const visible = filter === "All" ? VEHICLES : VEHICLES.filter(v => v.status === filter);

  return (
    <div>
      <SectionHeader title="Fleet Inventory" sub="Real-time vehicle telemetry & status monitoring" />
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filter === s ? COLORS.primary : COLORS.surface,
            color: filter === s ? "#fff" : COLORS.textMuted,
            border: `1px solid ${filter === s ? COLORS.primary : COLORS.border}`,
            borderRadius: 8, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 500,
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {visible.map(v => (
          <div key={v.id} style={{
            background: COLORS.surface, borderRadius: 14, padding: 20,
            border: `1px solid ${COLORS.border}`,
            borderTop: `3px solid ${v.status === "Available" ? COLORS.success : v.status === "In Use" ? COLORS.primary : COLORS.warning}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>{v.name}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>{v.id} • {v.type}</div>
              </div>
              <Badge status={v.status} />
            </div>
            <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 14 }}>📍 {v.location}</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: COLORS.textMuted }}>{v.type === "EV" ? "🔋 Battery" : "⛽ Fuel"}</span>
                <span style={{ color: v.battery > 50 ? COLORS.success : v.battery > 25 ? COLORS.warning : COLORS.danger, fontWeight: 600 }}>{v.battery}%</span>
              </div>
              <div style={{ height: 6, background: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, width: `${v.battery}%`,
                  background: v.battery > 50 ? COLORS.success : v.battery > 25 ? COLORS.warning : COLORS.danger,
                }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: COLORS.textMuted, fontSize: 12 }}>🔄 {v.trips} trips</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "transparent", color: COLORS.primary, border: `1px solid ${COLORS.primary}`, borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Track</button>
                <button style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px dashed ${COLORS.border}` }}>
        <h3 style={{ color: COLORS.text, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Add New Vehicle</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          {["Vehicle Name", "Type", "Zone", "Registration"].map(f => (
            <div key={f}>
              <label style={{ color: COLORS.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>{f}</label>
              <input placeholder={f} style={{ width: "100%", background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <button style={{ background: COLORS.success, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>+ Add</button>
        </div>
      </div>
    </div>
  );
};

// ── ROUTE OPTIMIZATION ─────────────────────────────────────────────────────────
const RouteOptimization = () => {
  const [mode, setMode] = useState("Fastest");
  const routes = [
    { key: "Fastest", name: "Route A — Fastest", time: "18 min", dist: "12.4 km", eta: "2:34 PM", traffic: "Low",    color: COLORS.success },
    { key: "Eco",     name: "Route B — Eco",     time: "24 min", dist: "9.8 km",  eta: "2:40 PM", traffic: "Medium", color: COLORS.warning },
    { key: "Scenic",  name: "Route C — Scenic",  time: "31 min", dist: "14.2 km", eta: "2:47 PM", traffic: "High",   color: COLORS.danger  },
  ];

  return (
    <div>
      <SectionHeader title="AI Route Optimization" sub="Dynamic routing powered by real-time traffic & ML-based ETA prediction" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div style={{ background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <div style={{ position: "relative", height: 380, background: "#0a1628", overflow: "hidden" }}>
            {[...Array(8)].map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${i * 50}px`, height: 1, background: "#1e3a5f44" }} />)}
            {[...Array(10)].map((_, i) => <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * 50}px`, width: 1, background: "#1e3a5f44" }} />)}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d="M80 330 Q150 280 180 200 Q210 130 280 80" stroke={COLORS.success} strokeWidth={mode === "Fastest" ? 4 : 2} fill="none" strokeLinecap="round" opacity={mode === "Fastest" ? 1 : 0.3} />
              <path d="M80 330 Q100 270 160 230 Q230 190 280 80" stroke={COLORS.warning} strokeWidth={mode === "Eco" ? 4 : 2} fill="none" strokeLinecap="round" strokeDasharray="8 4" opacity={mode === "Eco" ? 1 : 0.3} />
              <path d="M80 330 Q200 320 320 200 Q360 150 280 80" stroke={COLORS.danger}  strokeWidth={mode === "Scenic" ? 4 : 2} fill="none" strokeLinecap="round" strokeDasharray="4 6" opacity={mode === "Scenic" ? 1 : 0.3} />
              <circle cx="80" cy="330" r="8" fill={COLORS.success} />
              <circle cx="80" cy="330" r="14" fill="none" stroke={COLORS.success} strokeWidth={2} opacity={0.4} />
              <circle cx="280" cy="80" r="8" fill={COLORS.danger} />
              <circle cx="280" cy="80" r="14" fill="none" stroke={COLORS.danger} strokeWidth={2} opacity={0.4} />
            </svg>
            <div style={{ position: "absolute", left: 50, bottom: 20, color: COLORS.text, fontSize: 12, fontWeight: 600 }}>📍 Start: Central Bus Depot</div>
            <div style={{ position: "absolute", left: 220, top: 20, color: COLORS.text, fontSize: 12, fontWeight: 600 }}>🏁 End: Airport T2</div>
            <div style={{ position: "absolute", left: 220, top: 200, background: "#ef444422", border: "1px solid #ef444444", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: COLORS.danger }}>⚠ High Traffic Zone</div>
          </div>
          <div style={{ padding: 16, display: "flex", gap: 10 }}>
            {["Fastest", "Eco", "Scenic"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "9px 0",
                background: mode === m ? COLORS.primary : COLORS.bg,
                color: mode === m ? "#fff" : COLORS.textMuted,
                border: `1px solid ${mode === m ? COLORS.primary : COLORS.border}`,
                borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}>{m}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {routes.map(r => (
            <div key={r.key} onClick={() => setMode(r.key)} style={{
              background: COLORS.surface, borderRadius: 12, padding: 18, cursor: "pointer",
              border: `1px solid ${mode === r.key ? r.color : COLORS.border}`,
              borderLeft: `4px solid ${r.color}`,
              opacity: mode === r.key ? 1 : 0.7,
              transform: mode === r.key ? "scale(1.02)" : "scale(1)",
              transition: "all 0.2s",
            }}>
              <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{r.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["⏱ ETA", r.time], ["📏 Distance", r.dist], ["🕒 Arrival", r.eta], ["🚦 Traffic", r.traffic]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{k}</div>
                    <div style={{ color: mode === r.key ? r.color : COLORS.text, fontWeight: 600, fontSize: 13 }}>{v}</div>
                  </div>
                ))}
              </div>
              {mode === r.key && <div style={{ marginTop: 10, color: r.color, fontSize: 11, fontWeight: 600 }}>✓ SELECTED ROUTE</div>}
            </div>
          ))}
          <div style={{ background: "#0ea5e910", borderRadius: 12, padding: 16, border: `1px solid ${COLORS.primary}44` }}>
            <div style={{ color: COLORS.primary, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>🤖 AI INSIGHT</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5 }}>ML model predicts 22% higher traffic on NH-16 between 5–7 PM. Eco route recommended for EV vehicles to maximise range efficiency.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MAINTENANCE ANALYTICS ──────────────────────────────────────────────────────
const MaintenanceAnalytics = () => (
  <div>
    <SectionHeader title="Predictive Maintenance" sub="AI-powered vehicle health monitoring & predictive alerts" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
      <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 18, fontSize: 14 }}>Component Health Over Time</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={HEALTH_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="month" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} domain={[50, 100]} />
            <Tooltip contentStyle={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="battery" stroke={COLORS.primary}  strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tyres"   stroke={COLORS.warning}  strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="engine"  stroke={COLORS.success}  strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="brakes"  stroke={COLORS.danger}   strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 18, fontSize: 14 }}>Fleet Maintenance Status</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={MAINTENANCE_PIE} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={4}>
                {MAINTENANCE_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div>
            {MAINTENANCE_PIE.map(p => (
              <div key={p.name} style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: p.color }} />
                <div>
                  <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{p.value} vehicles</div>
                  <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div style={{ background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>⚠ Maintenance Alerts</div>
        <span style={{ color: COLORS.danger, fontSize: 12, background: "#450a0a", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{MAINTENANCE_ALERTS.length} alerts</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: COLORS.bg }}>
            {["Vehicle ID", "Vehicle", "Issue", "Severity", "Recommended Action", "Due"].map(h => (
              <th key={h} style={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600, padding: "10px 18px", textAlign: "left", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MAINTENANCE_ALERTS.map((a, i) => (
            <tr key={a.id} style={{ borderTop: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "transparent" : `${COLORS.bg}44` }}>
              <td style={{ padding: "12px 18px", color: COLORS.textMuted, fontSize: 13 }}>{a.id}</td>
              <td style={{ padding: "12px 18px", color: COLORS.text, fontSize: 13, fontWeight: 500 }}>{a.vehicle}</td>
              <td style={{ padding: "12px 18px", color: COLORS.textMuted, fontSize: 13 }}>{a.issue}</td>
              <td style={{ padding: "12px 18px" }}><Badge status={a.severity} /></td>
              <td style={{ padding: "12px 18px", color: COLORS.textMuted, fontSize: 13 }}>{a.action}</td>
              <td style={{ padding: "12px 18px", color: a.due === "Immediate" ? COLORS.danger : COLORS.warning, fontSize: 13, fontWeight: 600 }}>{a.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ── BOOKING & AI RECOMMENDATIONS ───────────────────────────────────────────────
const BookingRecommendations = () => {
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("2026-03-25");
  const [time, setTime] = useState("10:00");
  const [hours, setHours] = useState(3);
  const [filterEV, setFilterEV] = useState(false);
  const [booked, setBooked] = useState(false);
  const visible = filterEV ? BOOKING_VEHICLES.filter(v => v.type === "EV") : BOOKING_VEHICLES;

  if (booked) return (
    <div>
      <SectionHeader title="Customer Booking" sub="AI-powered vehicle recommendations" />
      <div style={{ textAlign: "center", background: COLORS.surface, borderRadius: 16, padding: 60, border: `1px solid ${COLORS.success}44` }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: COLORS.success, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ color: COLORS.textMuted }}>{selected?.name} • {date} at {time} • {hours} hrs</p>
        <p style={{ color: COLORS.text, fontWeight: 600, fontSize: 18 }}>Total: ₹{selected ? selected.pricePerHr * hours : 0}</p>
        <button onClick={() => { setBooked(false); setSelected(null); }} style={{ marginTop: 24, background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Book Another</button>
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader title="Customer Booking" sub="AI-powered vehicle recommendations based on your preferences" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button onClick={() => setFilterEV(false)} style={{ background: !filterEV ? COLORS.primary : COLORS.surface, color: !filterEV ? "#fff" : COLORS.textMuted, border: `1px solid ${!filterEV ? COLORS.primary : COLORS.border}`, borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>All Vehicles</button>
            <button onClick={() => setFilterEV(true)}  style={{ background: filterEV  ? COLORS.success : COLORS.surface, color: filterEV  ? "#fff" : COLORS.textMuted, border: `1px solid ${filterEV  ? COLORS.success : COLORS.border}`, borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer" }}>⚡ EV Only</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visible.map(v => (
              <div key={v.id} onClick={() => setSelected(v)} style={{
                background: COLORS.surface, borderRadius: 12, padding: 20, cursor: "pointer",
                border: `1px solid ${selected?.id === v.id ? COLORS.primary : COLORS.border}`,
                position: "relative", transition: "all 0.2s",
                boxShadow: selected?.id === v.id ? `0 0 0 2px ${COLORS.primary}44` : "none",
              }}>
                {v.recommended && (
                  <div style={{ position: "absolute", top: -10, left: 16, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.purple})`, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>🤖 AI RECOMMENDED</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: v.recommended ? 8 : 0 }}>
                  <div>
                    <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 16 }}>{v.name}</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>{v.type} • {v.seats} seats • ★ {v.rating}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: COLORS.primary, fontWeight: 800, fontSize: 20 }}>₹{v.pricePerHr}</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 11 }}>per hour</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {v.features.map(f => (
                    <span key={f} style={{ background: COLORS.bg, color: COLORS.textMuted, fontSize: 11, padding: "3px 10px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.surface, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ color: COLORS.text, fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📅 Booking Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[["Date", "date", date, setDate], ["Pick-up Time", "time", time, setTime]].map(([label, type, val, setter]) => (
              <div key={label}>
                <label style={{ color: COLORS.textMuted, fontSize: 12, display: "block", marginBottom: 5 }}>{label}</label>
                <input type={type} value={val} onChange={e => setter(e.target.value)} style={{ width: "100%", background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div>
              <label style={{ color: COLORS.textMuted, fontSize: 12, display: "block", marginBottom: 5 }}>Duration: <b style={{ color: COLORS.text }}>{hours} hrs</b></label>
              <input type="range" min={1} max={12} value={hours} onChange={e => setHours(+e.target.value)} style={{ width: "100%" }} />
            </div>
            {selected ? (
              <div style={{ background: COLORS.bg, borderRadius: 10, padding: 14, border: `1px solid ${COLORS.border}` }}>
                <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 8 }}>BOOKING SUMMARY</div>
                <div style={{ color: COLORS.text, fontWeight: 600 }}>{selected.name}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>{date} at {time} • {hours} hrs</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }}>
                  <span style={{ color: COLORS.textMuted }}>Total</span>
                  <span style={{ color: COLORS.primary, fontWeight: 800, fontSize: 18 }}>₹{selected.pricePerHr * hours}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: COLORS.textMuted, fontSize: 12, textAlign: "center", padding: 12 }}>← Select a vehicle to continue</div>
            )}
            <button disabled={!selected} onClick={() => selected && setBooked(true)} style={{
              background: selected ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` : COLORS.surfaceHigh,
              color: selected ? "#fff" : COLORS.textMuted, border: "none", borderRadius: 10,
              padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: selected ? "pointer" : "not-allowed",
            }}>
              {selected ? "Confirm Booking →" : "Select a vehicle first"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("Admin");
  const [page, setPage] = useState("dashboard");

  const handleLogin = (r) => {
    setRole(r);
    setLoggedIn(true);
    setPage(r === "Customer" ? "bookings" : r === "Driver" ? "routes" : "dashboard");
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />;

  const PAGES = {
    dashboard:   <AdminDashboard />,
    fleet:       <FleetInventory />,
    routes:      <RouteOptimization />,
    maintenance: <MaintenanceAnalytics />,
    bookings:    <BookingRecommendations />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar active={page} onNav={setPage} role={role} onLogout={() => setLoggedIn(false)} />
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <span style={{ background: "#052e16", color: COLORS.success, border: `1px solid ${COLORS.success}44`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>● System Online</span>
        </div>
        {PAGES[page]}
      </main>
    </div>
  );
}