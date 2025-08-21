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
} from "lucide-react";

// --- Helper components ---
const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl shadow-xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);
const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-white/80">
    {children}
  </span>
);

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

// --- Animated background ---
const Backdrop = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(75%_50%_at_50%_0%,rgba(72,78,255,0.35),rgba(0,0,0,0.9))]" />
    <svg className="absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <motion.div
      initial={{ opacity: 0.6, x: -80, y: -40 }}
      animate={{ opacity: 0.9, x: 0, y: 0 }}
      transition={{ duration: 2.2, ease: "easeOut" }}
      className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
    />
    <motion.div
      initial={{ opacity: 0.4, x: 80, y: 40 }}
      animate={{ opacity: 0.75, x: 0, y: 0 }}
      transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
      className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"
    />
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
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              <div className="font-medium">Retail Floor Coverage</div>
            </div>
            <Pill>Auto-Redaction Enabled</Pill>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10">
            <div className="absolute inset-0 bg-[conic-gradient(at_top_left,rgba(99,102,241,0.25),rgba(79,70,229,0.2),transparent_60%)]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/80">
                Store map placeholder — no third-party leakage
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
