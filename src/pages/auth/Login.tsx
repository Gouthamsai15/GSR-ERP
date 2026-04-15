import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
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

          <Card className={`auth-card auth-form-card w-full max-w-md ${shake ? "shake-card" : ""}`}>
            <div className="auth-mobile-intro lg:hidden">
              <div className="auth-brand-header">
                <div className="auth-brand-logo">G</div>
                <div className="auth-brand-name">GSR ERP</div>
              </div>
              <span className="auth-kicker">School Login</span>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">
                Sign in to continue to your dashboard.
              </p>
            </div>

            <div className="auth-desktop-intro">
              <span className="auth-kicker">School Login</span>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">
                Sign in to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email or Student ID"
                labelClassName="auth-label"
                className="auth-input"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  labelClassName="auth-label"
                  className="auth-input pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-2xl select-none transition-transform active:scale-90"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "🐵"}
                </button>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={submitting} className="auth-submit">
                {submitting ? (
                  "Signing in..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            {error && (
              <p className="mt-4 text-center text-sm font-semibold text-rose-600">
                {error}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
