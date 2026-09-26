import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Eye, EyeOff, AlertCircle, CheckCircle2, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profession: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  // If already authenticated, redirect to /home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errs.email = 'Email ID is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (isRegisterMode && formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (isRegisterMode) {
      if (!formData.name.trim()) {
        errs.name = 'Full name is required.';
      }
      if (!formData.phone.trim()) {
        errs.phone = 'Phone number is required.';
      } else if (!/^[+]?[\d\s-]{7,15}$/.test(formData.phone.trim())) {
        errs.phone = 'Please enter a valid phone number (7-15 digits).';
      }
      if (!formData.address.trim()) {
        errs.address = 'Address is required.';
      }
      if (!formData.profession.trim()) {
        errs.profession = 'Profession is required.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setServerSuccess('');

    try {
      if (isRegisterMode) {
        await register(formData);
        setServerSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/home');
        }, 800);
      } else {
        await login(formData.email.trim(), formData.password);
        navigate('/home');
      }
    } catch (err) {
      // In case of login failure or register error, display appropriate message
      if (!isRegisterMode) {
        setServerError('Invalid email or password.');
      } else {
        setServerError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrors({});
    setServerError('');
    setServerSuccess('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)'
    }}>
      <div className="form-card" style={{ width: '100%', maxWidth: isRegisterMode ? '620px' : '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            border: '2px solid var(--primary-border)',
            color: 'var(--primary)',
            marginBottom: '0.75rem'
          }}>
            <Sprout size={36} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
            AGROTRADE
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {isRegisterMode ? 'Create your new seller & buyer account' : 'Sign in to access your agricultural marketplace'}
          </p>
        </div>

        {/* Server Feedback Alert */}
        {serverError && (
          <div className="alert alert-danger" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {serverSuccess && (
          <div className="alert alert-success" role="alert">
            <CheckCircle2 size={18} />
            <span>{serverSuccess}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} noValidate>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Rahul Patel"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.name && <p className="field-error-text">{errors.name}</p>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email ID <span className="req">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <p className="field-error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="req">*</span>
            </label>
            <div className="input-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder={isRegisterMode ? 'At least 6 characters' : 'Enter your password'}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="field-error-text">{errors.password}</p>}
          </div>

          {isRegisterMode && (
            <>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone Number <span className="req">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.phone && <p className="field-error-text">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profession">
                    Profession <span className="req">*</span>
                  </label>
                  <input
                    id="profession"
                    name="profession"
                    type="text"
                    className={`form-input ${errors.profession ? 'error' : ''}`}
                    placeholder="e.g. Farmer / Trader"
                    value={formData.profession}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.profession && <p className="field-error-text">{errors.profession}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  Address / City <span className="req">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="e.g. Ahmedabad, Gujarat"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.address && <p className="field-error-text">{errors.address}</p>}
              </div>
            </>
          )}

          <div style={{ marginTop: '1.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>{isRegisterMode ? 'Creating account...' : 'Logging in...'}</span>
                </>
              ) : (
                <>
                  {isRegisterMode ? <UserPlus size={18} /> : <LogIn size={18} />}
                  <span>{isRegisterMode ? 'Create Account' : 'LOGIN'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Toggle between Login and Register */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: '0.5rem',
                fontSize: '0.95rem',
                textDecoration: 'underline'
              }}
            >
              {isRegisterMode ? 'Sign In / Login' : 'Create Account / Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
