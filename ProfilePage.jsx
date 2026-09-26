import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Phone, MapPin, Briefcase, Edit, LogOut,
  ShoppingBag, Tag, PlusCircle, ArrowLeft, Camera
} from 'lucide-react';
import ProfilePictureModal from '../components/ProfilePictureModal';
import UpdateProfileModal from '../components/UpdateProfileModal';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  return (
    <div className="page-content">
      {/* Top back navigation */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/home" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <span className="brand-badge">User Profile</span>
      </div>

      <div className="profile-card">
        {/* Banner Header */}
        <div className="profile-card-header"></div>

        {/* Profile Card Body */}
        <div className="profile-card-body">
          {/* Avatar & Main Info */}
          <div className="profile-avatar-container">
            <div style={{ position: 'relative' }}>
              <img
                src={user?.profile_image_url || defaultAvatar}
                alt={user?.name || 'Profile Picture'}
                className="profile-avatar-img-btn"
                onClick={() => setIsPicModalOpen(true)}
                title="Click to view or change profile photo"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <button
                type="button"
                onClick={() => setIsPicModalOpen(true)}
                title="Change Photo"
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Camera size={16} />
              </button>
            </div>

            <div style={{ paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {user?.name || 'AgroTrade User'}
              </h2>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                {user?.profession || 'Agriculture Professional'}
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label>Full Name</label>
              <p>{user?.name || '—'}</p>
            </div>

            <div className="profile-info-item">
              <label>Email Address</label>
              <p>{user?.email || '—'}</p>
            </div>

            <div className="profile-info-item">
              <label>Phone Number</label>
              <p>{user?.phone || 'Not specified'}</p>
            </div>

            <div className="profile-info-item">
              <label>Profession</label>
              <p>{user?.profession || 'Not specified'}</p>
            </div>

            <div className="profile-info-item" style={{ gridColumn: 'span 2' }}>
              <label>Address / Location</label>
              <p>{user?.address || 'Not specified'}</p>
            </div>
          </div>

          {/* Action Buttons: Update Profile and Log Out */}
          <div className="profile-actions-stack">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsUpdateModalOpen(true)}
                style={{ flex: 1 }}
              >
                <Edit size={18} />
                <span>UPDATE PROFILE</span>
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
                style={{ flex: 1 }}
              >
                <LogOut size={18} />
                <span>LOG OUT</span>
              </button>
            </div>

            {/* History Navigation Buttons:
                Buying History: /buying-history
                Selling History: /selling-history
                Adding History: /adding-history
            */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                History & Activity
              </p>

              <div className="profile-history-links">
                <Link to="/buying-history" className="btn btn-secondary btn-sm" style={{ padding: '0.75rem' }}>
                  <ShoppingBag size={16} color="var(--primary)" />
                  <span>Buying History</span>
                </Link>

                <Link to="/selling-history" className="btn btn-secondary btn-sm" style={{ padding: '0.75rem' }}>
                  <Tag size={16} color="var(--primary)" />
                  <span>Selling History</span>
                </Link>

                <Link to="/adding-history" className="btn btn-secondary btn-sm" style={{ padding: '0.75rem' }}>
                  <PlusCircle size={16} color="var(--primary)" />
                  <span>Adding History</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Picture Popup Modal */}
      <ProfilePictureModal
        isOpen={isPicModalOpen}
        onClose={() => setIsPicModalOpen(false)}
      />

      {/* Update Profile Form Modal */}
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
}
