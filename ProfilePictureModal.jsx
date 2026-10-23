import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { profileApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePictureModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  const handleFileChange = (e) => {
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please choose an image file first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profile_image', selectedFile);

      const res = await profileApi.uploadAvatar(formData);
      updateUser({ profile_image_url: res.profile_image_url });
      setSuccess('Profile picture updated successfully.');
      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccess('');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to upload profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayImage = previewUrl || user?.profile_image_url || defaultAvatar;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Profile Picture</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {error && (
            <div className="alert alert-danger" style={{ textAlign: 'left' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ textAlign: 'left' }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Larger Profile Image Preview */}
          <div style={{ margin: '1rem auto 1.5rem', width: '220px', height: '220px' }}>
            <img
              src={currentDisplayImage}
              alt={user?.name || 'Profile Picture'}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--primary-border)',
                boxShadow: 'var(--shadow-md)',
                background: '#ffffff'
              }}
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: '0.75rem' }}>
              <Upload size={18} />
              <span>{selectedFile ? 'Change Selected Image' : 'Upload New Photo'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            {selectedFile && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose} disabled={loading}>
            Close
          </button>
          {selectedFile && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Uploading image...</span>
                </>
              ) : (
                'Save Picture'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
