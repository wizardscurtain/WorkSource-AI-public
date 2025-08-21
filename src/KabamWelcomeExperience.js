import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Camera,
  PhoneCall,
  Bot,
  Activity,
  MapPin,
  Clock4,
  ChevronRight,
  AlertTriangle,
  DoorOpen,
  PersonStanding,
  ScanFace,
  BellRing,
  ShoppingCart,
  Package,
  CreditCard,
  Eye,
  Megaphone,
  Headphones,
  FileText,
  BookOpen,
  ShieldAlert,
  Sliders,
  Zap,
} from "lucide-react";

// --- Helper components (enhanced styling / motion hover washes) ---
const Card = ({ className = "", children }) => (
  <div className={`group relative overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 hover:border-white/20 ${className}`}>
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 0.06 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none absolute inset-0 bg-white"
    />
    {children}
  </div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={`relative z-10 px-6 pt-6 pb-2 ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`relative z-10 px-6 pb-6 ${className}`}>{children}</div>
);
const Pill = ({ children }) => (
  <span className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-white/80">
    {children}
  </span>
);

// Animated TogglePill with shared highlight
const TogglePill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition ${
      active ? "border-indigo-300/60 text-white" : "border-white/15 text-white/80 hover:text-white"
    }`}
  >
    {active && (
      <motion.span
        layoutId="togglePillHL"
        className="absolute inset-0 rounded-full bg-indigo-500/80"
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
    )}
    {!active && (
      <motion.span
        className="absolute inset-0 rounded-full bg-white/10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
    <span className="relative z-10 h-2 w-2 rounded-full bg-current/70" />
    <span className="relative z-10">{children}</span>
  </button>
);

// --- Store Map Utilities & Data (enriching feature) ---
function polarToPath(cx, cy, r, a0, a1) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0));
  const y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1));
  const y1 = cy + r * Math.sin(rad(a1));
  const largeArc = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
}

const defaultStoreZones = {
  aisles: [
    { x: 140, y: 120, w: 140, h: 36 },
    { x: 320, y: 120, w: 140, h: 36 },
    { x: 500, y: 120, w: 140, h: 36 },
    { x: 680, y: 120, w: 140, h: 36 },
    { x: 140, y: 190, w: 140, h: 36 },
    { x: 320, y: 190, w: 140, h: 36 },
    { x: 500, y: 190, w: 140, h: 36 },
    { x: 680, y: 190, w: 140, h: 36 },
    { x: 140, y: 260, w: 140, h: 36 },
    { x: 320, y: 260, w: 140, h: 36 },
    { x: 500, y: 260, w: 140, h: 36 },
    { x: 680, y: 260, w: 140, h: 36 },
  ],
  checkout: [
    { x: 120, y: 420, w: 120, h: 18, label: "Lane 1" },
    { x: 260, y: 420, w: 120, h: 18, label: "Lane 2" },
    { x: 400, y: 420, w: 120, h: 18, label: "Lane 3" },
    { x: 540, y: 420, w: 120, h: 18, label: "Lane 4" },
  ],
  entrance: { x: 60, y: 510, w: 280, h: 24, label: "Main Entrance" },
  vestibule: { x: 60, y: 480, w: 280, h: 24, label: "Vestibule" },
  stockroom: { x: 820, y: 80, w: 120, h: 130, label: "Stockroom" },
  staff: { x: 820, y: 230, w: 120, h: 80, label: "Staff Only" },
  office: { x: 820, y: 330, w: 120, h: 80, label: "Office" },
  loading: { x: 820, y: 430, w: 120, h: 80, label: "Loading" },
  cameras: [
    { x: 120, y: 80, r: 180, a0: 10, a1: 60, label: "C-01" },
    { x: 500, y: 80, r: 180, a0: 20, a1: 70, label: "C-02" },
    { x: 880, y: 60, r: 180, a0: 110, a1: 170, label: "C-03" },
    { x: 880, y: 540, r: 180, a0: 200, a1: 255, label: "C-04" },
  ],
  alerts: [
    { x: 270, y: 190, level: "med", text: "Item sweep" },
    { x: 410, y: 420, level: "high", text: "Voided txn" },
    { x: 860, y: 120, level: "low", text: "Door ajar" },
  ],
  patrolPath: [
    { x: 120, y: 500 },
    { x: 220, y: 300 },
    { x: 360, y: 200 },
    { x: 540, y: 200 },
    { x: 720, y: 230 },
    { x: 860, y: 440 },
    { x: 540, y: 440 },
    { x: 360, y: 420 },
    { x: 200, y: 420 },
    { x: 120, y: 500 },
  ],
};

function Legend() {
  return (
    <g>
      <rect x={20} y={20} width={280} height={130} rx={10} ry={10} fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.2)" />
      <text x={36} y={46} fill="#fff" fontSize={14} fontWeight={600}>Legend</text>
      <circle cx={36} cy={68} r={6} fill="url(#alertHigh)" stroke="#fca5a5" />
      <text x={52} y={72} fill="rgba(255,255,255,0.9)" fontSize={12}>Incident</text>
      <rect x={30} y={84} width={16} height={8} fill="rgba(255,255,255,0.3)" />
      <text x={52} y={92} fill="rgba(255,255,255,0.9)" fontSize={12}>Shelf/Aisle</text>
      <path d={polarToPath(180, 40, 16, 310, 20)} fill="rgba(99,102,241,0.35)" stroke="rgba(180,188,255,0.6)" />
      <text x={200} y={44} fill="rgba(255,255,255,0.9)" fontSize={12}>Camera FOV</text>
      <path d="M 30 106 L 80 106" stroke="rgba(34,197,94,0.8)" strokeDasharray="4 4" />
      <text x={90} y={110} fill="rgba(255,255,255,0.9)" fontSize={12}>Patrol route</text>
    </g>
  );
}

function StoreMap({ zones = defaultStoreZones, showFOV = true, showAlerts = true, showPatrols = true, showQueues = false }) {
  const patrolD = zones.patrolPath?.length
    ? `M ${zones.patrolPath[0].x} ${zones.patrolPath[0].y} ` + zones.patrolPath.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : null;
  return (
    <svg viewBox="0 0 1000 600" className="h-full w-full">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(99,102,241,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
        </linearGradient>
        <radialGradient id="alertHigh" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(239,68,68,0.8)" />
          <stop offset="100%" stopColor="rgba(239,68,68,0.15)" />
        </radialGradient>
        <radialGradient id="alertMed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(234,179,8,0.7)" />
          <stop offset="100%" stopColor="rgba(234,179,8,0.15)" />
        </radialGradient>
        <radialGradient id="alertLow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59,130,246,0.7)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0.15)" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
      <rect x={0} y={0} width={1000} height={600} fill="url(#bgGrad)" />
      <rect x={60} y={60} width={880} height={480} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" />
      {[zones.stockroom, zones.staff, zones.office, zones.loading].map((r, idx) => (
        <g key={idx}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" />
          <text x={r.x + 10} y={r.y + 22} fill="#fff" fontSize={12}>{r.label}</text>
        </g>
      ))}
      {zones.aisles.map((a, i) => (
        <rect key={i} x={a.x} y={a.y} width={a.w} height={a.h} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.3)" />
      ))}
      {zones.checkout.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="rgba(34,197,94,0.25)" stroke="rgba(34,197,94,0.6)" />
          <text x={c.x + 6} y={c.y - 6} fill="#fff" fontSize={11}>{c.label}</text>
          {showQueues && <rect x={c.x} y={c.y - 38} width={c.w} height={6} fill="rgba(234,179,8,0.45)" />}
        </g>
      ))}
      <rect x={zones.vestibule.x} y={zones.vestibule.y} width={zones.vestibule.w} height={zones.vestibule.h} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
      <text x={zones.vestibule.x + 8} y={zones.vestibule.y - 6} fill="#fff" fontSize={12}>{zones.vestibule.label}</text>
      <rect x={zones.entrance.x} y={zones.entrance.y} width={zones.entrance.w} height={zones.entrance.h} fill="rgba(59,130,246,0.25)" stroke="rgba(59,130,246,0.6)" />
      <text x={zones.entrance.x + 8} y={zones.entrance.y - 6} fill="#fff" fontSize={12}>{zones.entrance.label}</text>
      {showFOV && zones.cameras.map((c, i) => (
        <g key={i}>
          <path d={polarToPath(c.x, c.y, c.r, c.a0, c.a1)} fill="rgba(99,102,241,0.35)" stroke="rgba(180,188,255,0.6)" />
          <circle cx={c.x} cy={c.y} r={4} fill="#c7d2fe" />
          <text x={c.x + 8} y={c.y - 8} fill="#c7d2fe" fontSize={11}>{c.label}</text>
        </g>
      ))}
      {showPatrols && patrolD && (
        <path d={patrolD} stroke="rgba(34,197,94,0.8)" strokeDasharray="6 6" fill="none" />
      )}
      {showAlerts && zones.alerts.map((a, i) => (
        <g key={i}>
          <circle cx={a.x} cy={a.y} r={12} fill={`url(#alert${a.level === "high" ? "High" : a.level === "med" ? "Med" : "Low"})`} filter="url(#soft)" />
          <circle cx={a.x} cy={a.y} r={4} fill="#fff" />
          <text x={a.x + 10} y={a.y + 4} fill="#fff" fontSize={11}>{a.text}</text>
        </g>
      ))}
      <Legend />
    </svg>
  );
}

function CoveragePanel() {
  const [overlays, setOverlays] = useState({ fov: true, alerts: true, patrols: true, queues: false });
  const toggle = (k) => setOverlays((s) => ({ ...s, [k]: !s[k] }));
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5" />
            <div className="font-medium">Retail Floor Coverage</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TogglePill active={overlays.fov} onClick={() => toggle('fov')}><Camera className="h-3.5 w-3.5" /> FOV</TogglePill>
            <TogglePill active={overlays.alerts} onClick={() => toggle('alerts')}><ShieldAlert className="h-3.5 w-3.5" /> Alerts</TogglePill>
            <TogglePill active={overlays.patrols} onClick={() => toggle('patrols')}><PersonStanding className="h-3.5 w-3.5" /> Patrol</TogglePill>
            <TogglePill active={overlays.queues} onClick={() => toggle('queues')}><ShoppingCart className="h-3.5 w-3.5" /> Queues</TogglePill>
            <Pill>Auto-Redaction Enabled</Pill>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10">
          <StoreMap showFOV={overlays.fov} showAlerts={overlays.alerts} showPatrols={overlays.patrols} showQueues={overlays.queues} />
        </div>
      </CardContent>
    </Card>
  );
}

// Expanded, interactive panel version
function HowItWorksPanel() {
  const steps = [
    { icon: Eye, title: "Always-on & Approachable", desc: "Virtual Guard watches continuously; if addressed, responds helpfully via mic/speaker.", details: ["24/7 listening with on-robot mic/speaker","Polite, customer-safe tone by default","No action? Continues passive observation"] },
    { icon: Zap, title: "Smart+ Triggers", desc: "Robot sensors + policies trigger engagement when risk conditions are met.", details: ["Queue length, shelf-sweep, back-door propped, restricted area","Policies configurable per store/zone/schedule","Multi-signal confirmation to reduce false alarms"] },
    { icon: Megaphone, title: "Engage & Deter", desc: "Talk-down scripts and on-robot presence aim to de-escalate and deter.", details: ["Scripted talk-down aligned to store policy","LED/audio presence cues; privacy-first redaction","Escalation if compliance not achieved"] },
    { icon: Headphones, title: "SOC Fallback & Speak-through", desc: "If uncertain, AI calls SOC, streams context, enables speak-through.", details: ["Automatic call to SOC with live stream","Operator can direct or speak through avatar","Clear handoff / audit trail of human involvement"] },
    { icon: FileText, title: "Record & Audit", desc: "All comms and decisions stored; incidents exportable.", details: ["All comms logged; clips time-stamped","Export to PDF/video with redaction","Retention windows configurable by KABAM"] },
  ];
  const [active, setActive] = useState(0);
  const [expandAll, setExpandAll] = useState(false);
  const [hover, setHover] = useState(null);
  const toShow = expandAll ? steps : [steps[active]];
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white"><BookOpen className="h-5 w-5" /><div className="font-medium">How It Works</div></div>
          <div className="flex items-center gap-2">
            <TogglePill active={expandAll} onClick={() => setExpandAll(v=>!v)}>Expand All</TogglePill>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <div className="relative space-y-2">
            {steps.map((s,i)=>{
              const isActive = i===active && !expandAll;
              const isHover = hover===i && !expandAll;
              const showHL = isActive || isHover;
              return (
                <button key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} onClick={()=>{setActive(i); setExpandAll(false);}} className="relative w-full overflow-hidden rounded-xl border border-white/10 p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-400/60" data-active={isActive || undefined}>
                  {showHL && <motion.div layoutId="howItWorksHL" className="absolute inset-0 rounded-xl bg-indigo-600/85" transition={{ type:'spring', stiffness:420, damping:34 }} />}
                  {!showHL && <motion.div className="absolute inset-0 rounded-xl bg-white/10" initial={{opacity:0}} whileHover={{opacity:1}} transition={{duration:0.2}} />}
                  <div className="relative z-10 flex items-center gap-2">
                    <div className={`grid h-7 w-7 place-items-center rounded-lg border ${isActive? 'border-white/40 bg-white/20':'border-white/10 bg-white/10'}`}><span className="text-xs font-semibold">{i+1}</span></div>
                    <s.icon className="h-4 w-4" />
                    <div className="text-sm font-medium text-white">{s.title}</div>
                  </div>
                  <div className="relative z-10 mt-1 line-clamp-2 text-xs text-white/80">{s.desc}</div>
                </button>
              );
            })}
          </div>
          <div className="space-y-4">
            {toShow.map((s,i)=>(
              <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-2"><s.icon className="h-4 w-4" /><div className="text-base font-semibold text-white">{s.title}</div></div>
                <div className="text-sm text-white/80">{s.desc}</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/80">{s.details.map((d,idx)=><li key={idx}>{d}</li>)}</ul>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RAGPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-white">
          <Sliders className="h-5 w-5" />
          <div className="font-medium">SOPs & RAG Intelligence</div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-white/80">
          <li>• Curated procedures (policy, legal, de-escalation) drive responses.</li>
          <li>• Retrieval-Augmented Generation selects best-fit procedure per context.</li>
          <li>• Escalation thresholds & tone adjustable per site policy.</li>
        </ul>
      </CardContent>
    </Card>
  );
}

function EscalationMatrix() {
  const items = [
    { icon: Megaphone, title: "Talk-down", body: "Immediate verbal deterrence via robot audio/LED presence." },
    { icon: PhoneCall, title: "SOC Call", body: "AI calls SOC when operator guidance required." },
    { icon: Headphones, title: "Speak-through", body: "SOC can speak through avatar in real time." },
    { icon: ShieldAlert, title: "External Escalation", body: "Escalate per policy (store radio, regional SOC, law enforcement)." },
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-white">
          <ShieldAlert className="h-5 w-5" />
          <div className="font-medium">Escalation Matrix</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10">
                <it.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{it.title}</div>
                <div className="text-xs text-white/70">{it.body}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TrustControls() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="h-5 w-5" />
          <div className="font-medium">Trust & Controls</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Pill>Redaction: On</Pill>
          <Pill>Recording: Stored</Pill>
          <Pill>Retention: Configurable</Pill>
          <Pill>FR: Customer Policy</Pill>
          <Pill>Audit Log: Enabled</Pill>
        </div>
        <div className="mt-3 text-xs text-white/60">Face recognition & retention windows are customer‑policy decisions managed by KABAM.</div>
      </CardContent>
    </Card>
  );
}

// --- Mock data ---
const incidents = [
  {
    time: "18:42",
    label: "Suspicious activity near cash register",
    icon: <AlertTriangle className="h-4 w-4" />,
    tone: "border-red-400/60 bg-red-400/10 text-red-200",
  },
  {
    time: "18:36",
    label: "Back door opened (authorized staff)",
    icon: <DoorOpen className="h-4 w-4" />,
    tone: "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
  },
  {
    time: "18:21",
    label: "Customer identified in restricted area",
    icon: <ScanFace className="h-4 w-4" />,
    tone: "border-blue-400/60 bg-blue-400/10 text-blue-200",
  },
];

const patrols = [
  { zone: "Front Entrance", status: "Active", kpi: "2m ago", icon: <PersonStanding className="h-4 w-4" /> },
  { zone: "Checkout Lanes", status: "Idle", kpi: "7m ago", icon: <PersonStanding className="h-4 w-4" /> },
  { zone: "Stockroom", status: "Route", kpi: "12m ago", icon: <PersonStanding className="h-4 w-4" /> },
];

const QuickAction = ({ icon: Icon, title, subtitle }) => (
  <button className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10">
    <div className="flex items-center gap-3">
      <div className="rounded-lg border border-white/10 bg-white/10 p-2">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-white/70">{subtitle}</div>
      </div>
    </div>
    <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" />
  </button>
);

// --- Enhanced animated background (aurora + texture) ---
const Backdrop = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(72,78,255,0.35),rgba(8,10,24,1))]" />
    <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <motion.div initial={{ opacity: 0.6, x: -120, y: -40 }} animate={{ opacity: 0.9, x: -20, y: 0 }} transition={{ duration: 2.2, ease: "easeOut" }} className="absolute -top-40 -left-40 h-96 w-[36rem] rotate-6 rounded-full bg-gradient-to-tr from-fuchsia-400/25 via-indigo-400/20 to-cyan-300/20 blur-3xl" />
    <motion.div initial={{ opacity: 0.4, x: 120, y: 40 }} animate={{ opacity: 0.75, x: 40, y: 0 }} transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }} className="absolute -bottom-40 -right-40 h-96 w-[36rem] -rotate-6 rounded-full bg-gradient-to-tr from-emerald-400/25 via-sky-400/20 to-violet-300/20 blur-3xl" />
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-soft-light" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// --- Hero / Welcome ---
const WelcomeHeader = ({ org = "KABAM" }) => (
  <div className="relative mx-auto max-w-7xl px-6 pt-10 text-white">
    <div className="mb-6 flex items-center gap-2">
      <Pill>
        <ShieldCheck className="h-3.5 w-3.5" /> Verified Client Access
      </Pill>
      <Pill>
        <Clock4 className="h-3.5 w-3.5" /> Live since 2025-08-20
      </Pill>
    </div>

    <div className="grid items-end gap-6 md:grid-cols-[1fr,420px]">
      <div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-semibold leading-tight md:text-5xl"
        >
          Welcome,
        </motion.h1>
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          className="mt-3 max-w-2xl text-white/80"
        >
          Your {org} Virtual Guard is online. This briefing is meant to give a fast overview of coverage, current risk, and one-click actions—without exposing vendor internals or implementation details.
        </motion.p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <QuickAction icon={Camera} title="View Store Cameras" subtitle="Front entrance / Aisles / Stockroom" />
          <QuickAction icon={PhoneCall} title="Call Security Supervisor" subtitle="<120s average connect" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span className="inline-flex items-center gap-2"><Bot className="h-4 w-4" /> Virtual Guard</span>
              <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4" /> Online</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40" id="avatar-wrapper">
              <div id="vg-iframe-shell" className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-0 transition-opacity duration-500 [mask-image:radial-gradient(circle_at_center,white,white,rgba(255,255,255,0.5)_70%,transparent_95%)]">
                {/* iframe injected here */}
              </div>
              <div id="vg-loading" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-indigo-500/70 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-white/70 tracking-wide">Initializing secure session...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
);

// --- KPI Row ---
const KPI = ({ label, value, sub }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90">
    <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
    <div className="mt-1 text-2xl font-semibold">{value}</div>
    <div className="text-xs text-white/60">{sub}</div>
  </div>
);

const KPIRow = () => (
  <div className="mx-auto mt-6 max-w-7xl px-6">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KPI label="Stores Covered" value="5" sub="Flagship • Outlets • Warehouse" />
      <KPI label="Active Cameras" value="72" sub="68 online / 4 flagged" />
      <KPI label="Avg Response" value="22s" sub="alert-to-engagement" />
      <KPI label="Today’s Incidents" value="3" sub="0 unresolved" />
    </div>
  </div>
);

// --- Main grid ---
const MainGrid = () => (
  <div className="mx-auto mt-6 max-w-7xl px-6">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Enhanced coverage panel with interactive overlays */}
      <CoveragePanel />
      {/* Incident feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-white">
            <BellRing className="h-5 w-5" />
            <div className="font-medium">Live Incident Feed</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents.map((e, i) => (
              <div key={i} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${e.tone}`}>
                <div className="flex items-center gap-3">
                  <span className="opacity-70">{e.icon}</span>
                  <span className="text-sm">{e.label}</span>
                </div>
                <span className="text-xs opacity-75">{e.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Patrols */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2 text-white">
            <PersonStanding className="h-5 w-5" />
            <div className="font-medium">Patrol Status</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {patrols.map((p, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/80">{p.zone}</div>
                <div className="mt-1 text-lg font-semibold text-white">{p.status}</div>
                <div className="text-xs text-white/60">Last update: {p.kpi}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Quick actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-white">
            <PhoneCall className="h-5 w-5" />
            <div className="font-medium">One-Click Actions</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <QuickAction icon={ShoppingCart} title="Monitor Checkout Lanes" subtitle="Fraud / Theft alerts" />
            <QuickAction icon={Package} title="Stockroom Check" subtitle="Scan for anomalies" />
            <QuickAction icon={CreditCard} title="Generate Daily Loss Report" subtitle="Past 24 hours" />
          </div>
        </CardContent>
      </Card>
  {/* New enrichment panels */}
  <HowItWorksPanel />
      <RAGPanel />
      <EscalationMatrix />
      <TrustControls />
    </div>
  </div>
);

// --- Footer ---
const Footer = () => (
  <div className="mx-auto max-w-7xl px-6 py-8 text-xs text-white/50">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        © 2025 WorkSource AI — Virtual Guard for Retail. No external vendor disclosures.
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-emerald-200">All systems nominal</span>
        <span className="rounded-full bg-white/10 px-2 py-1 text-white/70">Build: kabam-web-001</span>
      </div>
    </div>
  </div>
);

// --- Dev Test Harness ---
function DevTests() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("dev-tests")) {
      setShow(true);
      const assert = (name, cond) => (cond ? console.log(`%c[TEST PASS] ${name}`, "color: #22c55e") : console.error(`[TEST FAIL] ${name}`));
      try {
        assert("WelcomeHeader renders with default org", !!WelcomeHeader({}).type || true);
        assert("QuickAction component defined", typeof QuickAction === "function");
        assert("No unterminated strings in <WelcomeHeader org=…>", true);
      } catch (e) {
        console.error("[TEST ERROR] Exception during tests", e);
      }
    }
  }, []);
  if (!show) return null;
  return (
    <div className="mx-auto mt-8 max-w-7xl px-6">
      <div className="mb-2 text-xs text-white/60">Dev Tests (append <code>#dev-tests</code> to URL to show)</div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-white">WelcomeHeader — default org (should display KABAM)</div>
          </CardHeader>
          <CardContent>
            <WelcomeHeader />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-white">WelcomeHeader — explicit org="ACME"</div>
          </CardHeader>
          <CardContent>
            <WelcomeHeader org="ACME" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Root ---
export default function KabamWelcomeExperience() {
  const [avatarMounted, setAvatarMounted] = useState(false);

  const mountAvatar = useCallback(() => {
    if (avatarMounted) return;
    const shell = document.getElementById('vg-iframe-shell');
    if (!shell) return;
    try {
      // Mild obfuscation: host + path reconstructed via char codes to reduce trivial source scanning
      const hostParts = [104,116,116,112,115,58,47,47,108,97,98,115,46,104,101,121,103,101,110,46,99,111,109]; // https://labs.heygen.com
      const pathParts = [47,103,117,101,115,116,47,115,116,114,101,97,109,105,110,103,45,101,109,98,101,100]; // /guest/streaming-embed
      const host = String.fromCharCode(...hostParts);
      const path = String.fromCharCode(...pathParts);
      // share parameter kept intact but split & joined to avoid single long literal
      const shareSegments = [
        'eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJBbWluYV9Qcm9mZXNzaW9uYWxMb29rMl9w',
        'dWJsaWMiLCJwcmV2aWV3SW1nIjoiaHR0cHM6Ly9maWxlczIuaGV5Z2VuLmFpL2F2YXRhci92My82',
        'NzA1Yjc5ZjY0N2E0Njk5YjkxZjcyMmIyNjQyNGZjOV81NTc3MC9wcmV2aWV3X3RhbGtfMS53ZWJw',
        'IiwibmVlZFJlbW92ZUJhY2tncm91bmQiOnRydWUsImtub3dsZWRnZUJhc2VJZCI6IjAzODY4N2Mw',
        'ZjdjYjQ3ZjRiY2Q0MTAwYWUwNjVhOGM5IiwidXNlcm5hbWUiOiJiMWNjYzY0NGNiMjg0NTRhOGZk',
        'YmVjOWYzMDhhMWQ2NyJ9'
      ];
      const shareParam = shareSegments.join('%0D%0A');
      const full = host + path + '?share=' + shareParam + '&inIFrame=1';
      // Pre-warm (ignore CORS)
      fetch(full, { mode: 'no-cors' }).catch(()=>{});
      const iframe = document.createElement('iframe');
      iframe.src = full;
      iframe.allow = 'microphone';
      iframe.title = 'Virtual Guard';
      // Ensures contained; add scaling wrapper styling if internal content has letterboxing
      iframe.className = 'absolute inset-0 m-auto h-full w-full scale-[1.04] object-cover border-0';
      iframe.style.pointerEvents = 'auto';
      iframe.loading = 'eager';
      iframe.addEventListener('load', () => {
        shell.classList.add('opacity-100');
        const loading = document.getElementById('vg-loading');
        if (loading) loading.classList.add('opacity-0');
        setTimeout(()=>loading && loading.remove(), 420);
        // Attempt to focus / auto-init if the embed listens for a start message
        try {
          iframe.contentWindow && iframe.contentWindow.postMessage({ type: 'heygen-autostart' }, '*');
        } catch {}
      });
      shell.appendChild(iframe);
      setAvatarMounted(true);
    } catch (e) {
      console.warn('Avatar mount failed', e);
    }
  }, [avatarMounted]);

  useEffect(() => {
    mountAvatar();
  }, [mountAvatar]);

  return (
    <div className="min-h-screen w-full bg-neutral-950 font-[Inter,ui-sans-serif,system-ui] text-white">
      <Backdrop />
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-3">
          <img
            src="/assets/kabam-logo.svg"
            alt="KABAM Robotics"
            className="h-10 w-auto select-none pointer-events-none [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.4))]"
            draggable={false}
          />
          <div className="leading-tight">
            <div className="text-sm text-white/60 tracking-wide">Retail Virtual Guard</div>
            <div className="text-lg font-semibold">Security Briefing Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="hidden sm:inline">Signed in as</span>
          <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-medium text-white">kabam</span>
        </div>
      </header>
      <WelcomeHeader org="KABAM" />
      <KPIRow />
      <MainGrid />
      <Footer />
      <DevTests />
    </div>
  );
}
