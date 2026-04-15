import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bell,
  BookOpen,
  Bus,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  School,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  UserCheck,
  Zap,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";

const heroStats = [
  { label: "Active Modules", value: "15+", icon: <LayoutDashboard className="landing-home-icon-sm" /> },
  { label: "Data Accuracy", value: "99.9%", icon: <ShieldCheck className="landing-home-icon-sm" /> },
  { label: "Uptime Support", value: "24/7", icon: <Clock className="landing-home-icon-sm" /> },
];

const roleCards = [
  {
    title: "For Admins",
    desc: "Run admissions, staffing, fees, and records from one calm workspace instead of chasing scattered spreadsheets.",
    icon: <Users className="landing-home-icon-sm" />,
  },
  {
    title: "For Teachers",
    desc: "Capture attendance, publish marks, and manage class communication with faster daily workflows.",
    icon: <GraduationCap className="landing-home-icon-sm" />,
  },
  {
    title: "For Parents",
    desc: "Follow student progress, receive school alerts, and stay connected without waiting for offline updates.",
    icon: <Bell className="landing-home-icon-sm" />,
  },
];

const features = [
  {
    title: "Complete School Management",
    desc: "Manage admissions, attendance, exams, fees, staff, and transport from a single connected platform.",
    icon: <School className="landing-home-icon-md" />,
    tone: "emerald",
  },
  {
    title: "Real-Time Dashboard",
    desc: "See live visibility into operations, performance, and financial health without waiting on manual reports.",
    icon: <LayoutDashboard className="landing-home-icon-md" />,
    tone: "sky",
  },
  {
    title: "Secure Access System",
    desc: "Give every user the right access level with role-based security built for school workflows.",
    icon: <ShieldCheck className="landing-home-icon-md" />,
    tone: "violet",
  },
  {
    title: "Automation & Notifications",
    desc: "Automate routine tasks and send timely alerts so important updates reach the right people faster.",
    icon: <Bell className="landing-home-icon-md" />,
    tone: "amber",
  },
  {
    title: "Fast & Scalable",
    desc: "Stay fast as your school grows, with a system designed to handle daily activity at scale.",
    icon: <Zap className="landing-home-icon-md" />,
    tone: "rose",
  },
  {
    title: "Modern UI Experience",
    desc: "Work with a clean, responsive interface that feels approachable for every school team.",
    icon: <Smartphone className="landing-home-icon-md" />,
    tone: "teal",
  },
];

const modules = [
  { name: "Student Management", icon: <GraduationCap className="landing-home-icon-sm" /> },
  { name: "Staff & Payroll", icon: <UserCheck className="landing-home-icon-sm" /> },
  { name: "Attendance Tracking", icon: <Clock className="landing-home-icon-sm" /> },
  { name: "Fee Collection", icon: <CreditCard className="landing-home-icon-sm" /> },
  { name: "Exams & Results", icon: <BookOpen className="landing-home-icon-sm" /> },
  { name: "Timetable Pro", icon: <Calendar className="landing-home-icon-sm" /> },
  { name: "Transport/GPS", icon: <Bus className="landing-home-icon-sm" /> },
  { name: "Smart Analytics", icon: <BarChart3 className="landing-home-icon-sm" /> },
];

const steps = [
  {
    step: "01",
    title: "Configure",
    desc: "Set up classes, sections, staff, and core structure with a guided onboarding flow.",
    icon: <Users className="landing-home-icon-sm" />,
  },
  {
    step: "02",
    title: "Onboard",
    desc: "Bring staff, students, and parents into the system with secure role-based access.",
    icon: <ShieldCheck className="landing-home-icon-sm" />,
  },
  {
    step: "03",
    title: "Operate",
    desc: "Run daily school operations digitally with reporting, alerts, and cleaner follow-through.",
    icon: <Zap className="landing-home-icon-sm" />,
  },
];

export const Home = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="top" data-theme="landing" className="landing-home-shell">
      <Navbar />

      <main className="landing-home-main">
        <section className="landing-home-hero">
          <div className="landing-home-container landing-home-hero-grid">
            <div className="landing-home-copy">
              <h1 className="landing-home-title">
                <span className="landing-home-title-lead">Modern school operations,</span>
                <span className="landing-home-title-accent">finally in one clear system.</span>
              </h1>

              <p className="landing-home-subtitle">
                GSR ERP brings admissions, attendance, academics, fees, communication, and transport
                into one polished platform built to reduce friction for admins, teachers, parents, and students.
              </p>

              <div className="landing-home-actions">
                <Link to="/login" className="landing-home-primary-link">
                  Enter Dashboard <ArrowRight className="landing-home-icon-xs" />
                </Link>
                <button type="button" onClick={scrollToFeatures} className="landing-home-secondary-link">
                  Explore Features
                </button>
              </div>

              <div className="landing-home-trust-row">
                <div className="landing-home-trust-item">
                  <span className="landing-home-trust-dot" />
                  Built for schools
                </div>
                <div className="landing-home-trust-item">
                  <span className="landing-home-trust-dot" />
                  Role-based access
                </div>
                <div className="landing-home-trust-item">
                  <span className="landing-home-trust-dot" />
                  Mobile-ready workflow
                </div>
              </div>

              <div className="landing-home-stats">
                {heroStats.map((stat) => (
                  <Card key={stat.label} className="landing-home-stat-card">
                    <div className="landing-home-stat-icon">{stat.icon}</div>
                    <div className="landing-home-stat-value">{stat.value}</div>
                    <div className="landing-home-stat-label">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="landing-home-preview">
              <Card className="landing-home-preview-card">
                <div className="landing-home-preview-topbar">
                  <span className="landing-home-window-dot landing-home-window-dot--red" />
                  <span className="landing-home-window-dot landing-home-window-dot--amber" />
                  <span className="landing-home-window-dot landing-home-window-dot--green" />
                </div>

                <div className="landing-home-preview-body">
                  <div className="landing-home-preview-header">
                    <div>
                      <p className="landing-home-kicker">About GSR ERP</p>
                      <h2 className="landing-home-preview-title">A platform shaped around how schools actually work</h2>
                    </div>
                    <div className="landing-home-preview-pill">
                      <Sparkles className="landing-home-icon-xs" />
                      School-first
                    </div>
                  </div>

                  <div className="landing-home-preview-grid">
                    <div className="landing-home-preview-metric landing-home-preview-metric--emerald">
                      <span>Unified workflows</span>
                      <strong>One place</strong>
                      <p>Replace disconnected tools with one shared system for everyday school operations.</p>
                    </div>
                    <div className="landing-home-preview-metric landing-home-preview-metric--sky">
                      <span>Connected people</span>
                      <strong>Shared visibility</strong>
                      <p>Keep school leaders, teachers, parents, and students aligned with timely updates.</p>
                    </div>
                    <div className="landing-home-preview-metric landing-home-preview-metric--violet">
                      <span>Confident growth</span>
                      <strong>Built to scale</strong>
                      <p>Support growing institutions with structure, speed, and cleaner operational control.</p>
                    </div>
                  </div>

                  <div className="landing-home-preview-badges">
                    <span>Admissions</span>
                    <span>Attendance</span>
                    <span>Fees</span>
                    <span>Results</span>
                    <span>Transport</span>
                    <span>Analytics</span>
                  </div>

                  <div className="landing-home-preview-panel">
                    <div className="landing-home-preview-panel-head">
                      <h3>What makes the product valuable</h3>
                      <span>Core advantages</span>
                    </div>

                    <div className="landing-home-preview-activity">
                      <div className="landing-home-preview-activity-bar" />
                      <div>
                        <strong>Purpose-built for education</strong>
                        <p>GSR ERP is designed for school workflows first, instead of forcing institutions into generic business software.</p>
                      </div>
                    </div>

                    <div className="landing-home-preview-activity">
                      <div className="landing-home-preview-activity-bar landing-home-preview-activity-bar--amber" />
                      <div>
                        <strong>Cleaner admin experience</strong>
                        <p>We reduce paperwork, repetitive entry, and scattered follow-ups with one calmer operational workspace.</p>
                      </div>
                    </div>

                    <div className="landing-home-preview-activity">
                      <div className="landing-home-preview-activity-bar landing-home-preview-activity-bar--teal" />
                      <div>
                        <strong>Focused on trust and support</strong>
                        <p>The experience is built to feel secure, understandable, and practical for every team using it each day.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="landing-home-section">
          <div className="landing-home-container">
            <div className="landing-home-section-head landing-home-section-head--framed">
              <div>
                <p className="landing-home-section-eyebrow">Built for every role</p>
                <h2 className="landing-home-section-title">
                  A single platform for <span>admins, teachers, parents, and students</span>.
                </h2>
              </div>
              <p className="landing-home-section-copy">
                Everyone gets the right tools and the right level of access, with the same simple,
                reassuring experience across the entire school.
              </p>
            </div>

            <div className="landing-home-role-grid landing-home-role-grid--showcase">
              {roleCards.map((card) => (
                <Card key={card.title} className="landing-home-role-card">
                  <div className="landing-home-role-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="landing-home-section">
          <div className="landing-home-container">
            <div className="landing-home-section-head landing-home-section-head--center landing-home-section-head--framed">
              <div>
                <p className="landing-home-section-eyebrow">Powerful features</p>
                <h2 className="landing-home-section-title">
                  Everything you need to run a modern school.
                </h2>
              </div>
              <p className="landing-home-section-copy">
                Clear navigation, thoughtful automation, and a polished interface help your team
                stay focused on what matters most.
              </p>
            </div>

            <div className="landing-home-feature-grid landing-home-feature-grid--polished">
              {features.map((feature) => (
                <Card key={feature.title} className={`landing-home-feature-card landing-home-feature-card--${feature.tone}`}>
                  <div className={`landing-home-feature-icon landing-home-feature-icon--${feature.tone}`}>
                    {feature.icon}
                  </div>
                  <h3 className="landing-home-feature-title">{feature.title}</h3>
                  <p className="landing-home-feature-copy">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="landing-home-section">
          <div className="landing-home-container">
            <div className="landing-home-dual-grid landing-home-dual-grid--layered">
              <Card className="landing-home-module-card">
                <div className="landing-home-card-head">
                  <div>
                    <p className="landing-home-section-eyebrow">ERP modules</p>
                    <h2 className="landing-home-card-title">Everything in one place</h2>
                  </div>
                </div>

                <div className="landing-home-module-grid">
                  {modules.map((module) => (
                    <div key={module.name} className="landing-home-module-item">
                      <span className="landing-home-module-icon">{module.icon}</span>
                      <span>{module.name}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="landing-home-why-card">
                <div className="landing-home-card-head">
                  <div>
                    <p className="landing-home-section-eyebrow">Why schools choose it</p>
                    <h2 className="landing-home-card-title">Secure, simple, and dependable</h2>
                  </div>
                </div>

                <div className="landing-home-benefit-list">
                  {[
                    "Eliminate manual data-entry errors and paperwork.",
                    "See real-time visibility for principals and admins.",
                    "Send instant SMS and email notifications to parents.",
                    "Keep data protected with cloud-based backups.",
                    "Get a design that feels easy from the very first login.",
                  ].map((text) => (
                    <div key={text} className="landing-home-benefit-item">
                      <span className="landing-home-benefit-check">
                        <CheckCircle2 className="landing-home-icon-xs" />
                      </span>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="implementation" className="landing-home-section">
          <div className="landing-home-container">
            <div className="landing-home-section-head landing-home-section-head--center landing-home-section-head--framed">
              <div>
                <p className="landing-home-section-eyebrow">Implementation</p>
                <h2 className="landing-home-section-title">Launch in three simple steps.</h2>
              </div>
              <p className="landing-home-section-copy">
                Keep rollout simple so your team can move from setup to confident daily usage without a heavy learning curve.
              </p>
            </div>

            <div className="landing-home-steps landing-home-steps--polished">
              {steps.map((step) => (
                <Card key={step.step} className="landing-home-step-card">
                  <div className="landing-home-step-number">{step.step}</div>
                  <div className="landing-home-step-icon">{step.icon}</div>
                  <h3 className="landing-home-step-title">{step.title}</h3>
                  <p className="landing-home-step-copy">{step.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-home-section landing-home-cta-wrap">
          <div className="landing-home-container">
            <Card className="landing-home-cta-card">
              <div className="landing-home-cta-badge">
                <Sparkles className="landing-home-icon-xs" />
                Ready to go digital
              </div>
              <h2 className="landing-home-cta-title">
                Ready to digitalize your school operations?
              </h2>
              <p className="landing-home-cta-copy">
                Bring your school onto a cleaner, faster, and more organized platform. We can help
                you get started with a setup that feels comfortable for your whole team.
              </p>

              <div className="landing-home-cta-actions">
                <Link to="/login" className="landing-home-primary-link">
                  Get Started Now
                </Link>
                <button type="button" className="landing-home-cta-link">
                  Contact Sales
                </button>
              </div>
            </Card>
          </div>
        </section>

        <footer className="landing-home-footer">
          <div className="landing-home-container landing-home-footer-inner">
            <div>
              <div className="landing-home-footer-brand">GSR ERP</div>
              <p className="landing-home-footer-copy">© 2026 GSR ERP Systems. All rights reserved.</p>
            </div>

            <div className="landing-home-footer-links">
              <a href="#features">Features</a>
              <a href="#top">Privacy</a>
              <a href="#top">Terms</a>
            </div>

            <a href="#top" className="landing-home-backtop" aria-label="Back to top">
              <span className="landing-home-backtop-ripple" />
              <span className="landing-home-backtop-core">
                <ArrowUp className="landing-home-icon-xs" />
              </span>
              <span className="landing-home-backtop-label">Back to top</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
