import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User as UserIcon, LogOut, ShoppingBag, PlusCircle, Tag } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  return (
    <header className="navbar">
      <Link to="/home" className="brand-link">
        <Sprout size={28} color="#15803d" />
        <span>AGROTRADE</span>
        <span className="brand-badge">Marketplace</span>
      </Link>

      <nav className="nav-right">
        <Link to="/buy" className="btn btn-sm btn-secondary" title="Browse Products to Buy">
          <ShoppingBag size={16} />
          <span>Buy</span>
        </Link>
        <Link to="/sell" className="btn btn-sm btn-primary" title="Register Products to Sell">
          <Tag size={16} />
          <span>Sell</span>
        </Link>
        <Link to="/add" className="btn btn-sm btn-secondary" title="Add">
          <PlusCircle size={16} />
          <span>Add</span>
        </Link>

        <Link to="/profile" className="nav-user-chip" title="View Profile">
          <img
            src={user?.profile_image_url || defaultAvatar}
            alt={user?.name || 'User'}
            className="nav-avatar-mini"
            onError={(e) => { e.target.src = defaultAvatar; }}
          />
          <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-danger"
          title="Log Out"
          style={{ padding: '0.4rem 0.75rem' }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
}
