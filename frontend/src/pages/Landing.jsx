import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearStoredUser, useStoredUser } from "../services/authStorage";

const features = [
  {
    title: "Task Management",
    description: "Assign work, set priorities, and keep deadlines visible from kickoff to delivery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M8 7h10M8 12h10M8 17h10M4 7.5 5.5 9 8 5.5M4 12.5 5.5 14 8 10.5M4 17.5 5.5 19 8 15.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: "Real-time Chat",
    description: "Keep conversations inside each workspace so updates stay connected to the work.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M7 18.5 3.5 20V6.8A1.8 1.8 0 0 1 5.3 5h13.4a1.8 1.8 0 0 1 1.8 1.8v8.4a1.8 1.8 0 0 1-1.8 1.8H7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 10h8M8 13.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "File Sharing",
    description: "Store docs, assets, and submissions in one shared place the whole team can access.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M14 3H7.8A1.8 1.8 0 0 0 6 4.8v14.4A1.8 1.8 0 0 0 7.8 21h8.4A1.8 1.8 0 0 0 18 19.2V7Zm0 0v4h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: "Code Editor",
    description: "Move from planning to implementation with a built-in collaborative editor for your project code.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="m9 8-4 4 4 4M15 8l4 4-4 4M13.5 5 10.5 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    title: "Contribution Tracker",
    description: "See how teammates are contributing through tasks, chat, and file activity at a glance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M5 18V9M12 18V5M19 18v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Smart Alerts",
    description: "Surface urgent deadlines and overdue work early so teams can respond before things slip.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M12 9v4M12 17h.01M10.3 4.8 3.9 16a2 2 0 0 0 1.73 3h12.74A2 2 0 0 0 20.1 16L13.7 4.8a2 2 0 0 0-3.4 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
];

const steps = [
  {
    title: "Create account",
    description: "Sign up and launch your team workspace in a few clicks."
  },
  {
    title: "Create or join project",
    description: "Start a new project hub or enter an invite code to join an existing one."
  },
  {
    title: "Collaborate",
    description: "Chat, assign tasks, edit code, and share files without switching tools."
  },
  {
    title: "Track progress",
    description: "Monitor activity, contributions, and deadlines as the project moves forward."
  }
];

const heroHighlights = [
  { label: "Live Workspaces", value: "Projects, tasks, chat, and files stay in sync." },
  { label: "Faster Decisions", value: "See blockers early with contribution insights and alerts." },
  { label: "Built For Teams", value: "Everything is organized around the people doing the work." }
];

function SectionHeading({ badge, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex rounded-full border border-white/[0.15] bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
        {badge}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function FeatureCard({ feature, index }) {
  return (
    <article
      className="group rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-orange-300/[0.35] hover:bg-white/[0.12] motion-safe:opacity-0 motion-safe:animate-fade-up"
      style={{ animationDelay: `${index * 90}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/25 via-amber-300/25 to-teal-300/20 text-orange-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
        {feature.icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-white">{feature.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
    </article>
  );
}

function StepCard({ step, index }) {
  return (
    <article
      className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.28)] backdrop-blur motion-safe:opacity-0 motion-safe:animate-fade-up"
      style={{ animationDelay: `${index * 110}ms`, animationFillMode: "forwards" }}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300/25 to-orange-300/25 font-display text-lg font-bold text-white">
        0{index + 1}
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-white">{step.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
    </article>
  );
}

function Landing() {
  const navigate = useNavigate();
  const user = useStoredUser();

  const handleLogout = () => {
    clearStoredUser();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-body text-white">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.35),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.22),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_42%,_#020617_100%)]" />
        <div className="absolute left-[-5rem] top-24 -z-10 h-64 w-64 rounded-full bg-orange-400/[0.15] blur-3xl" />
        <div className="absolute right-[-3rem] top-36 -z-10 h-72 w-72 rounded-full bg-teal-300/[0.12] blur-3xl" />

        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="font-display text-xl font-bold tracking-tight text-white no-underline">
              Sync Space
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-full border border-white/[0.15] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:border-white/30 hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(249,115,22,0.36)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-white/[0.15] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:border-white/30 hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 no-underline shadow-[0_16px_40px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(249,115,22,0.36)]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main>
          <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-2xl">
                <div
                  className="motion-safe:opacity-0 motion-safe:animate-fade-in"
                  style={{ animationFillMode: "forwards" }}
                >
                  <span className="inline-flex rounded-full border border-orange-200/20 bg-orange-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
                    Collaboration Reimagined
                  </span>
                  <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Collaborate Smarter with Sync Space
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                    Manage tasks, chat, code, and files in one place.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {user ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 px-6 py-3 text-base font-semibold text-slate-950 no-underline shadow-[0_24px_50px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_54px_rgba(249,115,22,0.36)]"
                        >
                          Open Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/register"
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 px-6 py-3 text-base font-semibold text-slate-950 no-underline shadow-[0_24px_50px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_54px_rgba(249,115,22,0.36)]"
                        >
                          Get Started
                        </Link>
                        <Link
                          to="/login"
                          className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3 text-base font-semibold text-white no-underline transition hover:border-white/30 hover:bg-white/10"
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {heroHighlights.map((item, index) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-white/10 bg-white/[0.08] p-4 shadow-[0_16px_36px_rgba(15,23,42,0.28)] backdrop-blur motion-safe:opacity-0 motion-safe:animate-fade-up"
                      style={{ animationDelay: `${160 + index * 110}ms`, animationFillMode: "forwards" }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200">{item.label}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-200">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-10 -top-8 h-36 rounded-full bg-teal-300/[0.15] blur-3xl" />
                <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-[0_32px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6">
                  <div
                    className="motion-safe:opacity-0 motion-safe:animate-fade-up"
                    style={{ animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                          Project Pulse
                        </div>
                        <div className="mt-2 font-display text-2xl font-bold text-white">
                          One workspace. Less friction.
                        </div>
                      </div>
                      <div className="hidden rounded-2xl bg-emerald-400/[0.15] px-4 py-2 text-sm font-semibold text-emerald-200 sm:block">
                        Live
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                        <div className="text-sm font-semibold text-orange-200">Task flow</div>
                        <div className="mt-4 space-y-3">
                          <div className="rounded-2xl bg-slate-800/80 p-3">
                            <div className="text-sm font-semibold text-white">Finish presentation deck</div>
                            <div className="mt-1 text-xs text-slate-400">Due today - Assigned to Maya</div>
                          </div>
                          <div className="rounded-2xl bg-slate-800/80 p-3">
                            <div className="text-sm font-semibold text-white">Review API integration</div>
                            <div className="mt-1 text-xs text-slate-400">In progress - 2 teammates active</div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-teal-300/10 to-slate-900 p-4">
                        <div className="text-sm font-semibold text-teal-100">Team activity</div>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-3 py-3">
                            <span className="text-sm text-slate-300">Messages sent</span>
                            <span className="font-display text-xl font-bold text-white">128</span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-3 py-3">
                            <span className="text-sm text-slate-300">Files shared</span>
                            <span className="font-display text-xl font-bold text-white">34</span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-3 py-3">
                            <span className="text-sm text-slate-300">Tasks completed</span>
                            <span className="font-display text-xl font-bold text-white">19</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-r from-orange-300/[0.12] to-teal-300/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] motion-safe:animate-float">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Smart Alert
                          </div>
                          <div className="mt-2 text-sm text-slate-200">
                            Final report is due in 18 hours and still needs two reviews.
                          </div>
                        </div>
                        <div className="rounded-full bg-orange-300/[0.15] px-4 py-2 text-sm font-semibold text-orange-100">
                          Action needed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Features"
              title="Everything teams need to stay aligned without the tool overload."
              description="Sync Space combines planning, communication, execution, and visibility in a single focused environment."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </section>

          <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading
              badge="How It Works"
              title="A simple flow from first signup to final delivery."
              description="Set up quickly, invite your team, and keep progress visible every step of the way."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {steps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-slate-950/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <div className="font-display text-lg font-bold text-white">Sync Space</div>
              <p className="mt-2 max-w-xl leading-7 text-slate-400">
                A shared collaboration hub for tasks, chat, files, code, and team momentum.
              </p>
            </div>
            <div>Copyright {new Date().getFullYear()} Sync Space. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
