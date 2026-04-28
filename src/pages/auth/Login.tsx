import React, { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import LanguageSwitcher from "../../components/layout/LanguageSwitcher";
import { authStore } from "../../store/authStore";
import { loginWithIdentifier } from "../../services/authService";
import { getDefaultRouteForRole } from "../../utils/navigation";

export const Login = () => {
  const navigate = useNavigate();
  const { user, setAuth } = authStore();

  // Add CSS for the button hover effect
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .oauthButton::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #212121;
        z-index: -1;
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
        box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
        transition: all 250ms;
      }
      .oauthButton:hover::before {
        width: 100%;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-card login-card" style={{
            '--background': '#f0f4f8',
            '--input-focus': '#2d8cf0',
            '--font-color': '#1a1a1a',
            '--font-color-sub': '#64748b',
            '--bg-color': '#ffffff',
            '--main-color': '#1a1a1a',
            padding: '3rem',
            background: 'var(--background)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '24px',
            borderRadius: '16px',
            border: '3px solid var(--main-color)',
            boxShadow: '8px 8px var(--main-color), 0 4px 12px rgba(0,0,0,0.15)',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          } as React.CSSProperties}>
            {/* Header with welcome text and language switcher */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              marginBottom: '25px'
            }}>
              <div style={{
                flex: 1,
                textAlign: 'left'
              }}>
                <h1 style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: 'var(--font-color)',
                  fontWeight: '700',
                  fontSize: '28px',
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  Welcome back
                </h1>
                <p style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: 'var(--font-color-sub)',
                  fontWeight: '400',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  Sign in to continue to your secure dashboard
                </p>
              </div>
              <div style={{
                marginLeft: '20px'
              }}>
                <LanguageSwitcher isAuthTheme={true} />
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              marginBottom: '25px',
              width: '100%'
            }}>
              <div style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: 'var(--font-color)',
                fontWeight: '700',
                fontSize: '20px',
                marginBottom: '8px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                Login
                <span style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: 'var(--font-color-sub)',
                  fontWeight: '400',
                  fontSize: '14px'
                }}>
                  Sign in to your account
                </span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Email or Student ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{
                width: '100%',
                height: '65px',
                borderRadius: '12px',
                border: '3px solid var(--main-color)',
                backgroundColor: 'var(--bg-color)',
                boxShadow: '6px 6px var(--main-color)',
                fontSize: '18px',
                fontWeight: '500',
                color: 'var(--font-color)',
                padding: '22px 24px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
            />

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '65px',
                  borderRadius: '12px',
                  border: '3px solid var(--main-color)',
                  backgroundColor: 'var(--bg-color)',
                  boxShadow: '6px 6px var(--main-color)',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'var(--font-color)',
                  padding: '22px 24px',
                  outline: 'none',
                  paddingRight: '70px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="password-toggle"
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  width: '42px',
                  height: '42px',
                  color: 'var(--font-color)',
                  padding: '0',
                  transition: 'transform 0.2s ease'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="oauthButton"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                width: '100%',
                height: '70px',
                borderRadius: '14px',
                border: '3px solid var(--main-color)',
                backgroundColor: 'var(--bg-color)',
                boxShadow: '8px 8px var(--main-color)',
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--font-color)',
                cursor: 'pointer',
                transition: 'all 350ms',
                position: 'relative',
                overflow: 'hidden',
                zIndex: '1',
                boxSizing: 'border-box',
                marginTop: '25px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '10px 10px var(--main-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--font-color)';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '8px 8px var(--main-color)';
              }}
            >
              <span style={{ fontSize: '26px' }}>🔐</span>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>

            {error && (
              <p style={{
                color: '#ff4444',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                width: '100%'
              }}>
                {error}
              </p>
            )}

            {/* Back to Home button at bottom */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="oauthButton"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                height: '60px',
                borderRadius: '12px',
                border: '3px solid var(--main-color)',
                backgroundColor: 'var(--bg-color)',
                boxShadow: '6px 6px var(--main-color)',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--font-color)',
                cursor: 'pointer',
                transition: 'all 350ms',
                position: 'relative',
                overflow: 'hidden',
                zIndex: '1',
                boxSizing: 'border-box',
                marginTop: '30px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '8px 8px var(--main-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--font-color)';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '6px 6px var(--main-color)';
              }}
            >
              <span style={{ fontSize: '24px' }}>🏠</span>
              Back to Home
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
