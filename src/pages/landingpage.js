// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "./supabaseClient";
// import { motion } from "framer-motion";
// import { BarChart3, Leaf, ShieldCheck, LineChart, ArrowRight } from "lucide-react";

// if (typeof document !== "undefined") {
//   document.documentElement.style.scrollBehavior = "smooth";
// }

// const features = [
//   {
//     icon: BarChart3,
//     title: "Real-time monitoring",
//     description:
//       "Unified visibility across facilities with live emissions signals and anomaly alerts.",
//   },
//   {
//     icon: Leaf,
//     title: "Scope 1–3 automation",
//     description:
//       "Structured data capture and workflows aligned to GHG Protocol and reporting cycles.",
//   },
//   {
//     icon: LineChart,
//     title: "Forecasting & scenarios",
//     description:
//       "Model trajectories and initiatives so teams can prioritize what moves the needle.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Audit-ready reporting",
//     description:
//       "Exportable narratives and evidence trails designed for stakeholders and assurance.",
//   },
// ];

// const plans = [
//   {
//     name: "Starter",
//     blurb: "For teams piloting carbon accounting with a single region or BU.",
//     cta: "Talk to sales",
//   },
//   {
//     name: "Enterprise",
//     blurb: "Global rollouts, SSO, integrations, and dedicated success coverage.",
//     cta: "Request demo",
//     highlighted: true,
//   },
//   {
//     name: "Custom",
//     blurb: "Bespoke ESG data models, APIs, and partner integrations.",
//     cta: "Contact us",
//   },
// ];

// export default function LandingPage() {
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   useEffect(() => {
//     const checkSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       if (data.session) navigate("/home");
//     };
//     checkSession();
//   }, [navigate]);

// //   const handleDemoSubmit = async () => {
// //     const trimmed = email.trim();
// //     if (!trimmed) {
// //       setSubmitError("Please enter a valid work email.");
// //       return;
// //     }
//     const handleDemoSubmit = async () => {
//     const trimmed = email.trim();
  
//     if (!trimmed) {
//       setSubmitError("Please enter a valid work email.");
//       return;
//     }
  
//     setSubmitError("");
//     setLoading(true);
  
//     try {
//       // STEP 1: Save email into Supabase table
//       const { error } = await supabase.from("demo_requests").insert([
//         {
//           email: trimmed,
//           created_at: new Date().toISOString(),
//         },
//       ]);
  
//       if (error) throw error;
  
//       // STEP 2: Call Edge Function to send email notification
//       const response = await fetch(
//         "https://ltmuuqlqmjhcbbtyxhox.supabase.co/functions/v1/hyper-task",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: trimmed,
//           }),
//         }
//       );
  
//       const result = await response.json();
  
//       console.log("Edge Function response:", result);
  
//       if (!response.ok) {
//         throw new Error("Email sending failed");
//       }
  
//       // STEP 3: Success UI feedback
//       alert("✅ Demo request submitted successfully!");
  
//       setShowModal(false);
//       setEmail("");
//     } catch (err) {
//       console.error(err);
  
//       // fallback localStorage backup
//       try {
//         const key = "ecotrack_demo_requests_local";
//         const prev = JSON.parse(localStorage.getItem(key) || "[]");
  
//         prev.push({
//           email: trimmed,
//           created_at: new Date().toISOString(),
//         });
  
//         localStorage.setItem(key, JSON.stringify(prev));
//       } catch {}
  
//       setSubmitError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//     const { error } = await supabase.from("demo_requests").insert([
//       {
//         email: trimmed,
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     setLoading(false);

//     if (error) {
//       try {
//         const key = "ecotrack_demo_requests_local";
//         const prev = JSON.parse(localStorage.getItem(key) || "[]");
//         prev.push({ email: trimmed, created_at: new Date().toISOString() });
//         localStorage.setItem(key, JSON.stringify(prev));
//       } catch {
//         /* ignore */
//       }
//       setShowModal(false);
//       setEmail("");
//       navigate("/login");
//       return;
//     }

//     setShowModal(false);
//     setEmail("");
//     navigate("/login");
//   };

//   return (
//     <div className="relative min-h-screen overflow-x-hidden bg-[#070a12] text-slate-200 antialiased">
//       {/* Ambient background */}
//       <div
//         className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
//         aria-hidden
//       />
//       <div
//         className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[min(90vw,720px)] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]"
//         aria-hidden
//       />
//       <div
//         className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-cyan-500/5 blur-[100px]"
//         aria-hidden
//       />

//       {/* Nav */}
//       <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070a12]/80 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-2">
//             <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-bold text-slate-950">
//               E
//             </span>
//             <span className="text-lg font-semibold tracking-tight text-white">
//               EcoTrack
//             </span>
//           </div>

//           <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
//             <a href="#features" className="transition hover:text-white">
//               Product
//             </a>
//             <a href="#pricing" className="transition hover:text-white">
//               Plans
//             </a>
//           </nav>

//           <div className="flex shrink-0 items-center gap-2 sm:gap-3">
//             <button
//               type="button"
//               onClick={() => {
//                 setSubmitError("");
//                 setShowModal(true);
//               }}
//               className="rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-white/[0.04] sm:px-4 sm:text-sm"
//             >
//               Request demo
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate("/login")}
//               className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:gap-2 sm:px-5 sm:text-sm"
//             >
//               Sign in
//               <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
//             </button>
//           </div>
//         </div>
//       </header>

//       <main>
//         {/* Hero */}
//         <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400/90">
//               Carbon intelligence platform
//             </p>
//             <motion.h1
//               initial={{ opacity: 0, y: 24 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]"
//             >
//               Measure emissions with clarity. Act with confidence.
//             </motion.h1>
//             <p className="mt-5 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
//               Centralize Scope 1, 2, and 3 data, align teams on reduction initiatives,
//               and produce investor-grade sustainability reporting—without spreadsheet chaos.
//             </p>
//             <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//                 className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
//               >
//                 Open dashboard
//                 <ArrowRight className="h-4 w-4" aria-hidden />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSubmitError("");
//                   setShowModal(true);
//                 }}
//                 className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.04]"
//               >
//                 Schedule a walkthrough
//               </button>
//             </div>
//           </div>

//           {/* Preview card */}
//           <motion.div
//             initial={{ opacity: 0, y: 32 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10"
//           >
//             <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
//                   Emissions overview
//                 </p>
//                 <p className="mt-1 text-lg font-semibold text-white">
//                   Year-to-date intensity
//                 </p>
//               </div>
//               <p className="text-sm text-emerald-400/90">Sample data for illustration</p>
//             </div>
//             <div className="mt-8 flex h-44 items-end justify-between gap-2 sm:gap-4">
//               {[32, 48, 41, 56, 44, 62, 53].map((h, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ height: 0 }}
//                   animate={{ height: `${h}%` }}
//                   transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
//                   className="w-full max-w-[14%] rounded-t-md bg-gradient-to-t from-emerald-600/80 to-emerald-400"
//                 />
//               ))}
//             </div>
//             <div className="mt-6 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
//               {[
//                 { label: "Reporting period", value: "FY 2026 YTD" },
//                 { label: "Data coverage", value: "Scope 1–3" },
//                 { label: "Status", value: "On track" },
//               ].map((row) => (
//                 <div key={row.label}>
//                   <p className="text-xs text-slate-500">{row.label}</p>
//                   <p className="mt-1 text-sm font-medium text-slate-200">{row.value}</p>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </section>

//         {/* Features */}
//         <section
//           id="features"
//           className="border-t border-white/[0.06] bg-slate-950/40 py-20"
//         >
//           <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-2xl text-center">
//               <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
//                 Built for sustainability and finance teams
//               </h2>
//               <p className="mt-3 text-slate-400">
//                 A disciplined workflow from ingestion to disclosure—so numbers reconcile and
//                 narratives stay consistent.
//               </p>
//             </div>
//             <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//               {features.map((f) => {
//                 const Icon = f.icon;
//                 return (
//                   <motion.div
//                     key={f.title}
//                     whileHover={{ y: -2 }}
//                     transition={{ duration: 0.2 }}
//                     className="rounded-2xl border border-white/[0.06] bg-[#0c101c] p-6 shadow-lg shadow-black/20"
//                   >
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
//                       <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
//                     </div>
//                     <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
//                     <p className="mt-2 text-sm leading-relaxed text-slate-400">
//                       {f.description}
//                     </p>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* Pricing */}
//         <section id="pricing" className="py-20">
//           <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-2xl text-center">
//               <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
//                 Plans that scale with your footprint
//               </h2>
//               <p className="mt-3 text-slate-400">
//                 Pricing depends on sites, data volume, and integrations. We’ll align a package
//                 to your operating model.
//               </p>
//             </div>
//             <div className="mt-14 grid gap-6 md:grid-cols-3">
//               {plans.map((plan) => (
//                 <motion.div
//                   key={plan.name}
//                   whileHover={{ y: -2 }}
//                   className={`rounded-2xl border p-8 ${
//                     plan.highlighted
//                       ? "border-emerald-500/40 bg-emerald-500/[0.06] shadow-xl shadow-emerald-900/20"
//                       : "border-white/[0.06] bg-[#0c101c]"
//                   }`}
//                 >
//                   <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
//                   <p className="mt-3 text-sm leading-relaxed text-slate-400">{plan.blurb}</p>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSubmitError("");
//                       setShowModal(true);
//                     }}
//                     className={`mt-8 w-full rounded-full py-2.5 text-sm font-semibold transition ${
//                       plan.highlighted
//                         ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
//                         : "border border-white/10 text-slate-200 hover:border-white/20 hover:bg-white/[0.04]"
//                     }`}
//                   >
//                     {plan.cta}
//                   </button>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Modal */}
//       {showModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="demo-modal-title"
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c101c] p-8 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 id="demo-modal-title" className="text-xl font-semibold text-white">
//               Request a demo
//             </h2>
//             <p className="mt-2 text-sm text-slate-400">
//               Share your work email and we’ll follow up with next steps.
//             </p>
//             <input
//               type="email"
//               autoComplete="email"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 setSubmitError("");
//               }}
//               placeholder="you@company.com"
//               className="mt-6 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
//             />
//             {submitError && (
//               <p className="mt-2 text-sm text-red-400">{submitError}</p>
//             )}
//             <div className="mt-6 flex flex-col gap-3">
//               <button
//                 type="button"
//                 onClick={handleDemoSubmit}
//                 disabled={loading}
//                 className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
//               >
//                 {loading ? "Submitting…" : "Submit"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowModal(false);
//                   setSubmitError("");
//                 }}
//                 className="text-sm text-slate-500 transition hover:text-slate-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <footer className="border-t border-white/[0.06] py-10">
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left sm:px-6 lg:px-8">
//           <p>© {new Date().getFullYear()} EcoTrack. All rights reserved.</p>
//           <p className="max-w-md">
//             Carbon accounting and reporting tools for operational and ESG workflows.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { motion } from "framer-motion";
import { BarChart3, Leaf, ShieldCheck, LineChart, ArrowRight } from "lucide-react";

if (typeof document !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}

const features = [
  {
    icon: BarChart3,
    title: "Real-time monitoring",
    description:
      "Unified visibility across facilities with live emissions signals and anomaly alerts.",
  },
  {
    icon: Leaf,
    title: "Scope 1–3 automation",
    description:
      "Structured data capture and workflows aligned to GHG Protocol and reporting cycles.",
  },
  {
    icon: LineChart,
    title: "Forecasting & scenarios",
    description:
      "Model trajectories and initiatives so teams can prioritize what moves the needle.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready reporting",
    description:
      "Exportable narratives and evidence trails designed for stakeholders and assurance.",
  },
];

const plans = [
  {
    name: "Starter",
    blurb: "For teams piloting carbon accounting with a single region or BU.",
    cta: "Talk to sales",
  },
  {
    name: "Enterprise",
    blurb: "Global rollouts, SSO, integrations, and dedicated success coverage.",
    cta: "Request demo",
    highlighted: true,
  },
  {
    name: "Custom",
    blurb: "Bespoke ESG data models, APIs, and partner integrations.",
    cta: "Contact us",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/home");
    };
    checkSession();
  }, [navigate]);
  const handleDemoSubmit = async () => {
    const trimmed = email.trim();
  
    if (!trimmed) {
      setSubmitError("Please enter a valid work email.");
      return;
    }
  
    setSubmitError("");
    setLoading(true);
  
    try {
      // Insert into Supabase
      const { error } = await supabase
        .from("demo_requests")
        .insert([{ email: trimmed, created_at: new Date().toISOString() }]);
  
      if (error) throw error; // Only throw if Supabase insert fails
  
      // Call Edge function asynchronously, don't block submission
      fetch("https://ltmuuqlqmjhcbbtyxhox.supabase.co/functions/v1/hyper-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
        .then((res) => res.json())
        .then((res) => console.log("Edge function response:", res))
        .catch((err) => console.warn("Edge function failed:", err));
  
      // Success feedback
      setEmail("");
      setShowModal(false);
      alert("✅ Demo request submitted successfully!");
    } catch (err) {
      console.error("Supabase insert failed:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
//   const handleDemoSubmit = async () => {
//     const trimmed = email.trim();

//     if (!trimmed) {
//       setSubmitError("Please enter a valid work email.");
//       return;
//     }

//     setSubmitError("");
//     setLoading(true);

//     try {
//       const { error } = await supabase.from("demo_requests").insert([
//         {
//           email: trimmed,
//           created_at: new Date().toISOString(),
//         },
//       ]);

//       if (error) throw error;

//       const response = await fetch(
//         "https://ltmuuqlqmjhcbbtyxhox.supabase.co/functions/v1/hyper-task",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email: trimmed }),
//         }
//       );

//       const result = await response.json();
//       console.log("Edge Function response:", result);

//       if (!response.ok) {
//         throw new Error("Email sending failed");
//       }

//       alert("✅ Demo request submitted successfully!");
//       setShowModal(false);
//       setEmail("");
//     } catch (err) {
//       console.error(err);

//       try {
//         const key = "ecotrack_demo_requests_local";
//         const prev = JSON.parse(localStorage.getItem(key) || "[]");
//         prev.push({
//           email: trimmed,
//           created_at: new Date().toISOString(),
//         });
//         localStorage.setItem(key, JSON.stringify(prev));
//       } catch {
//         /* ignore */
//       }

//       setSubmitError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070a12] text-slate-200 antialiased">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[min(90vw,720px)] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-cyan-500/5 blur-[100px]"
        aria-hidden
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070a12]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-bold text-slate-950">
              E
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              EcoTrack
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Product
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Plans
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmitError("");
                setShowModal(true);
              }}
              className="rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-white/[0.04] sm:px-4 sm:text-sm"
            >
              Request demo
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:gap-2 sm:px-5 sm:text-sm"
            >
              Sign in
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400/90">
              Carbon intelligence platform
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]"
            >
              Measure emissions with clarity. Act with confidence.
            </motion.h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
              Centralize Scope 1, 2, and 3 data, align teams on reduction initiatives,
              and produce investor-grade sustainability reporting—without spreadsheet chaos.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitError("");
                  setShowModal(true);
                }}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Schedule a walkthrough
              </button>
            </div>
          </div>

          {/* Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10"
          >
            <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Emissions overview
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Year-to-date intensity
                </p>
              </div>
              <p className="text-sm text-emerald-400/90">Sample data for illustration</p>
            </div>
            <div className="mt-8 flex h-44 items-end justify-between gap-2 sm:gap-4">
              {[32, 48, 41, 56, 44, 62, 53].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                  className="w-full max-w-[14%] rounded-t-md bg-gradient-to-t from-emerald-600/80 to-emerald-400"
                />
              ))}
            </div>
            <div className="mt-6 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
              {[
                { label: "Reporting period", value: "FY 2026 YTD" },
                { label: "Data coverage", value: "Scope 1–3" },
                { label: "Status", value: "On track" },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-xs text-slate-500">{row.label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{row.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-t border-white/[0.06] bg-slate-950/40 py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Built for sustainability and finance teams
              </h2>
              <p className="mt-3 text-slate-400">
                A disciplined workflow from ingestion to disclosure—so numbers reconcile and
                narratives stay consistent.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-white/[0.06] bg-[#0c101c] p-6 shadow-lg shadow-black/20"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {f.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Plans that scale with your footprint
              </h2>
              <p className="mt-3 text-slate-400">
                Pricing depends on sites, data volume, and integrations. We'll align a package
                to your operating model.
              </p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl border p-8 ${
                    plan.highlighted
                      ? "border-emerald-500/40 bg-emerald-500/[0.06] shadow-xl shadow-emerald-900/20"
                      : "border-white/[0.06] bg-[#0c101c]"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{plan.blurb}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitError("");
                      setShowModal(true);
                    }}
                    className={`mt-8 w-full rounded-full py-2.5 text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "border border-white/10 text-slate-200 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c101c] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="demo-modal-title" className="text-xl font-semibold text-white">
              Request a demo
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Share your work email and we'll follow up with next steps.
            </p>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubmitError("");
              }}
              placeholder="you@company.com"
              className="mt-6 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none ring-emerald-500/0 transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
            {submitError && (
              <p className="mt-2 text-sm text-red-400">{submitError}</p>
            )}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDemoSubmit}
                disabled={loading}
                className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSubmitError("");
                }}
                className="text-sm text-slate-500 transition hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EcoTrack. All rights reserved.</p>
          <p className="max-w-md">
            Carbon accounting and reporting tools for operational and ESG workflows.
          </p>
        </div>
      </footer>
    </div>
  );
}