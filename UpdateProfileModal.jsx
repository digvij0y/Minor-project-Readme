import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { profileApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UpdateProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profession: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        profession: user.profession || ''
      });
      setErrors({});
      setServerError('');
      setServerSuccess('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email ID is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
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
      const res = await profileApi.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        profession: formData.profession.trim()
      });

      updateUser(res.user);
      setServerSuccess('Profile updated successfully.');

      setTimeout(() => {
        onClose();
        setServerSuccess('');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Unable to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Update Profile</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            {serverSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{serverSuccess}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="edit-name">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="edit-name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Patel"
                disabled={loading}
              />
              {errors.name && <p className="field-error-text">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-email">
                Email ID <span className="req">*</span>
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                disabled={loading}
              />
              {errors.email && <p className="field-error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-phone">
                Phone Number <span className="req">*</span>
              </label>
              <input
                id="edit-phone"
                name="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                disabled={loading}
              />
              {errors.phone && <p className="field-error-text">{errors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-profession">
                Profession <span className="req">*</span>
              </label>
              <input
                id="edit-profession"
                name="profession"
                type="text"
                className={`form-input ${errors.profession ? 'error' : ''}`}
                value={formData.profession}
                onChange={handleChange}
                placeholder="e.g. Farmer / Agriculture Trader"
                disabled={loading}
              />
              {errors.profession && <p className="field-error-text">{errors.profession}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-address">
                Address <span className="req">*</span>
              </label>
              <textarea
                id="edit-address"
                name="address"
                rows="3"
                className={`form-textarea ${errors.address ? 'error' : ''}`}
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Ahmedabad, Gujarat"
                disabled={loading}
              ></textarea>
              {errors.address && <p className="field-error-text">{errors.address}</p>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Updating profile...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
