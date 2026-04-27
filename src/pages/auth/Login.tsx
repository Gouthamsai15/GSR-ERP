import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Home, ShieldCheck, Sparkles } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LanguageSwitcher from "../../components/layout/LanguageSwitcher";
import { authStore } from "../../store/authStore";
import { loginWithIdentifier } from "../../services/authService";
import { getDefaultRouteForRole } from "../../utils/navigation";

export const Login = () => {
  const navigate = useNavigate();
  const { user, setAuth } = authStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  if (user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await loginWithIdentifier(identifier, password);
      const authedUser = result.user;
      if (!authedUser) {
        throw new Error("Unable to complete sign in.");
      }

      setTimeout(() => {
        setAuth(result);
        navigate(getDefaultRouteForRole(authedUser.role), { replace: true });
      }, 2000);
    } catch (err) {
      setSubmitting(false);
      setError("Invalid credentials. Try again!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div data-theme="auth">
      <div className="dashboard-shell auth-shell">
        <div className="auth-shell-inner px-6">
          <div className="auth-showcase hidden lg:block">
            <div className="auth-brand-header">
              <div className="auth-brand-logo">G</div>
              <div className="auth-brand-name">GSR ERP</div>
            </div>

            <span className="auth-showcase-badge">School management platform</span>
            <h1 className="auth-showcase-title">
              Simple, secure school management for your entire community.
            </h1>
            <p className="auth-showcase-copy">
              GSR ERP keeps attendance, updates, and student records in one clean workspace.
            </p>

            <div className="auth-showcase-grid">
              <div className="auth-showcase-stat">
                <Sparkles className="auth-showcase-stat-icon text-green-600" size={24} />
                <div className="auth-showcase-stat-label">Admissions</div>
                <div className="auth-showcase-stat-title">Fast onboarding</div>
                <p className="auth-showcase-stat-copy">Enroll students and parents without paperwork delays.</p>
              </div>

              <div className="auth-showcase-stat">
                <ShieldCheck className="auth-showcase-stat-icon text-green-600" size={24} />
                <div className="auth-showcase-stat-label">Security</div>
                <div className="auth-showcase-stat-title">Kid-safe records</div>
                <p className="auth-showcase-stat-copy">Protect student information with reliable access controls.</p>
              </div>
            </div>
          </div>

          <Card className={`auth-card auth-form-card w-full max-w-md mx-auto lg:mx-0 ${shake ? "shake-card" : ""}`}>
            {/* Mobile Layout */}
            <div className="auth-mobile-intro lg:hidden">
              <div className="flex items-center justify-end gap-3 mb-6">
                <LanguageSwitcher isAuthTheme={true} />
              </div>
              
              <div className="text-center mb-10">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#38a84e]/20 to-[#217a35]/20 blur-xl rounded-2xl -z-10"></div>
                  <h1 className="relative text-3xl font-bold text-[#1a2e1c] mb-2">Welcome back</h1>
                  <p className="relative text-sm text-[#556b51] leading-relaxed">
                    Sign in to continue to your secure dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="auth-desktop-intro hidden lg:flex">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#38a84e]/10 to-transparent rounded-full blur-3xl opacity-60"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-[#66bb6a]/10 to-transparent rounded-full blur-2xl opacity-40"></div>
                  <div className="relative bg-gradient-to-r from-[#f7faf4] via-[#eef8ec] to-[#e6f5e9] rounded-3xl p-8 shadow-xl border border-[#ccdec5]/20">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h1 className="text-4xl font-bold text-[#1a2e1c] mb-2">Welcome back</h1>
                        <p className="text-[#556b51] leading-relaxed">
                          Sign in to continue to your secure dashboard
                        </p>
                      </div>
                      <LanguageSwitcher isAuthTheme={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#1a2e1c] mb-3 tracking-wide">
                    Email Address or Student ID
                  </label>
                  <div className="relative">
                    <Input
                      label=""
                      className="auth-input pl-12 pr-4 h-14 text-base rounded-xl border-2 border-[#ccdec5]/30 bg-white/95 backdrop-blur-sm focus:border-[#38a84e] focus:bg-white focus:shadow-[0_0_0_20px_rgba(56,168,78,0.15)] focus:ring-4 focus:ring-[#38a84e]/20 transition-all duration-300"
                      placeholder="Enter your email or student ID"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                    <div className="absolute left-4 top-4 text-[#556b51] transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#1a2e1c] mb-3 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      label=""
                      type={showPassword ? "text" : "password"}
                      className="auth-input pl-12 pr-14 h-14 text-base rounded-xl border-2 border-[#ccdec5]/30 bg-white/95 backdrop-blur-sm focus:border-[#38a84e] focus:bg-white focus:shadow-[0_0_0_20px_rgba(56,168,78,0.15)] focus:ring-4 focus:ring-[#38a84e]/20 transition-all duration-300"
                      placeholder="Enter your secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={error}
                      required
                    />
                    <div className="absolute left-4 top-4 text-[#556b51] transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-[#556b51] hover:text-[#38a84e] transition-all duration-300 p-2 rounded-lg hover:bg-[#eef8ec]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <span className="text-2xl">🙈</span>
                      ) : (
                        <span className="text-2xl">🐵</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#38a84e] via-[#2f8a3e] to-[#1a5f2a] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#38a84e]/30 backdrop-blur-md transition-all duration-700 hover:shadow-[#38a84e]/40 hover:shadow-[#217a35]/20 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#38a84e]/60 focus:ring-offset-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:backdrop-blur-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4caf50] via-[#66bb6a] to-[#2e7d32] opacity-0 transition-all duration-700 group-hover:opacity-100"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-2000 group-hover:translate-x-full"></div>
                  <div className="relative flex items-center justify-center gap-4">
                    {submitting ? (
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center">
                              <div className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white/95 font-semibold text-sm">Authenticating</span>
                          <span className="text-white/70 font-medium text-xs">Securing session...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-[#38a84e]/40 to-[#217a35]/40 rounded-full blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-150"></div>
                          <ArrowRight
                            size={22}
                            className="relative transition-transform duration-700 group-hover:translate-x-2 group-hover:scale-125 group-hover:rotate-3 text-white drop-shadow-2xl filter drop-shadow-glow"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100"></div>
                        </div>

                        <div className="relative">
                          <span className="font-extrabold tracking-wider transition-all duration-700 group-hover:tracking-widest group-hover:text-white letter-spacing-0.05em">
                            SIGN IN
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#38a84e]/10 to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100"></div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-2xl border border-white/30 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:border-white/50"></div>
                  <div className="absolute inset-1 rounded-2xl border border-white/20 opacity-0 transition-all duration-1000 group-hover:opacity-100 scale-110"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-[#4caf50] to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100 blur-sm"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#66bb6a] to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100 blur-sm"></div>
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 scale-0 transition-all duration-300 group-active:scale-150 group-active:opacity-100"></div>
                </button>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-center text-sm font-semibold text-rose-600">
                {error}
              </p>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#f7faf4] to-[#eef8ec] px-6 py-3 text-sm font-medium text-[#1a2e1c] shadow-lg shadow-[#38a84e]/15 transition-all duration-300 hover:shadow-xl hover:shadow-[#38a84e]/25 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-white hover:to-[#e6f5e9] focus:outline-none focus:ring-2 focus:ring-[#38a84e] focus:ring-offset-2"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#38a84e]/8 to-[#217a35]/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <Home
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#38a84e]"
                />
                <span className="relative z-10 transition-all duration-300 group-hover:text-[#217a35]">Back to Home</span>
                <svg
                  className="relative z-10 h-4 w-4 text-[#556b51] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#38a84e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
