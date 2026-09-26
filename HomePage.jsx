import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Tag, PlusCircle, User, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  return (
    <div className="home-page-container">
      {/* Title */}
      <h1 className="home-brand-title">AGROTRADE</h1>
      <p className="home-tagline">
        Direct Agricultural Marketplace for Farmers, Traders & Buyers
      </p>

      {/* Circular Profile Icon Button */}
      <div className="home-profile-icon-wrapper">
        <Link to="/profile" className="home-profile-button" title="View Profile">
          <img
            src={user?.profile_image_url || defaultAvatar}
            alt={user?.name || 'Profile'}
            className="home-profile-img"
            onError={(e) => { e.target.src = defaultAvatar; }}
          />
        </Link>
        <p style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
          {user?.name || 'My Profile'}
        </p>
      </div>

      {/* Navigation Cluster matching requested structure:
             [ BUY ]      [ SELL ]
                   [ ADD ]
      */}
      <div className="home-actions-cluster">
        <div className="home-actions-row">
          <Link to="/buy" className="home-nav-btn home-btn-buy" title="Browse Products to Buy">
            <ShoppingBag size={24} />
            <span>BUY</span>
          </Link>

          <Link to="/sell" className="home-nav-btn home-btn-sell" title="Register Products to Sell">
            <Tag size={24} />
            <span>SELL</span>
          </Link>
        </div>

        <Link to="/add" className="home-nav-btn home-btn-add" title="Add">
          <PlusCircle size={22} />
          <span>ADD</span>
        </Link>

        {/* Profile Link Option */}
        <div style={{ marginTop: '1.25rem' }}>
          <Link
            to="/profile"
            className="btn btn-secondary"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.75rem', fontWeight: 600 }}
          >
            <User size={18} />
            <span>PROFILE</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
