import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function LoginScreen({ onAuth }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (user.trim().toLowerCase() === 'kabam' && pass === 'kabam') {
      localStorage.setItem('kabam_vg_auth', '1');
      onAuth();
    } else {
      setErr('Invalid credentials.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-sm">
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-xl font-semibold text-center">Kabam — Virtual Guard Briefing</h1>
          <p className="text-sm text-gray-300 text-center mt-2">Restricted access</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            {err && <div className="text-sm text-red-400">{err}</div>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-2 font-semibold"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Hint: kabam / kabam (demo)</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('kabam_vg_auth') === '1') {
      setAuthed(true);
    }
  }, []);

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;

  return (
    <div className="bg-white text-gray-900 font-sans">
      <style>{`
        .animated-sheen {
          background: radial-gradient(1200px 600px at 10% 10%, rgba(59,130,246,0.08), transparent 60%),
                      radial-gradient(900px 500px at 90% 30%, rgba(16,185,129,0.08), transparent 60%),
                      linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02));
          animation: sheenMove 16s linear infinite;
        }
        @keyframes sheenMove {
          0%   { background-position: 0% 0%, 100% 30%, 0 0; }
          50%  { background-position: 30% 20%, 70% 10%, 0 0; }
          100% { background-position: 0% 0%, 100% 30%, 0 0; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gray-950 text-white py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <div className="h-full w-full animated-sheen" />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            The Virtual Guard — Human Presence for Robotic Security
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-xl mt-6 text-gray-200">
            Kabam Robotics’ enterprise sentry platform, enhanced with WorkSource AI’s interactive Virtual Security Guard — a visible, protocol‑driven presence tailored for high‑traffic retail environments.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">How It Works</h2>
          <ul className="space-y-6 text-base md:text-lg leading-relaxed">
            <li><strong>Always On:</strong> The Virtual Guard avatar remains visible on the robot’s screen, creating an immediate point of contact for passers‑by.</li>
            <li><strong>Smart+ Integrated:</strong> Through Kabam’s Smart+ stack, the Virtual Guard reads the robot’s cameras and sensors to perceive, classify, and respond.</li>
            <li><strong>Protocol‑Driven:</strong> A software guard‑SOP library governs actions and language, ensuring consistency and compliance.</li>
            <li><strong>Escalation Ready:</strong> At any point, the Virtual Guard can brief Kabam’s GSOC for guidance — or hand over voice control to a human operator.</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">On‑Device Presence</h3>
          <div className="grid grid-cols-2 gap-4">
            {['/assets/virtual-guard-1.jpg', '/assets/virtual-guard-2.jpg'].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden bg-gray-200"
              >
                <picture>
                  <source srcSet={src} />
                  <img
                    src={src}
                    alt={`Virtual Guard face ${i + 1}`}
                    className="w-full h-full object-cover object-center"
                    decoding="async"
                    loading="lazy"
                  />
                </picture>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="relative bg-gray-50 py-16 md:py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="animated-sheen h-full w-full" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">Key Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Engagement Anytime', body: 'Visible, approachable presence 24/7 — greets shoppers, answers questions, and deters misconduct.' },
              { title: 'Instant Awareness', body: 'Real‑time perception via cameras and sensors; AI classification triggers appropriate responses.' },
              { title: 'Human Oversight', body: 'Rapid GSOC escalation — brief the operator or hand over voice control without losing continuity.' }
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group relative p-6 md:p-7 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden>
                  <div className="h-full w-full" style={{
                    background: 'radial-gradient(600px 200px at 20% 0%, rgba(59,130,246,0.07), transparent 60%), radial-gradient(600px 200px at 80% 100%, rgba(16,185,129,0.07), transparent 60%)'
                  }} />
                </div>
                <h3 className="relative font-semibold text-lg mb-3">{c.title}</h3>
                <p className="relative text-gray-700 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full‑width Interactive Avatar (obfuscated embed) */}
      <section className="py-6 md:py-10 px-0">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full aspect-video bg-black">
            <div id="virtual-guard-embed" className="absolute inset-0 w-full h-full border-0" />
          </div>
        </div>
      </section>

      {/* In Action */}
      <section className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">In Action: Real Retail Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: 'Lobby Greeting', body: 'Welcomes shoppers, verifies purpose of visit, provides directions, and supports store policies.' },
            { title: 'Night Patrol', body: 'Detects anomalies after hours, issues warnings, records evidence, and triggers escalation as needed.' },
            { title: 'Emergency Response', body: 'Maintains calm, delivers crowd instructions, streams context to GSOC for coordinated action.' }
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 md:p-7 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm"
            >
              <h3 className="font-semibold mb-3">{c.title}</h3>
              <p className="text-gray-700 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partnership Value */}
      <section className="relative bg-gray-950 text-white py-16 md:py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <div className="h-full w-full animated-sheen" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Why This Matters</h2>
          <p className="max-w-3xl mx-auto text-base md:text-xl text-gray-200">
            Kabam Robotics × WorkSource AI delivers mobile sentries with a professional, interactive front — protocol‑driven, sensor‑aware, and human‑backed. The result: higher deterrence, better shopper experience, and reliable escalation when it counts.
          </p>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const container = document.getElementById('virtual-guard-embed');
            if(!container) return;
            const iframe = document.createElement('iframe');
            iframe.allow = 'microphone';
            iframe.title = 'Virtual Guard';
            iframe.src = '/proxy/avatar';
            iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-modals');
            iframe.referrerPolicy = 'no-referrer';
            iframe.className = 'w-full h-full border-0';
            container.appendChild(iframe);
        })();
      `}} />
    </div>
  );
}
