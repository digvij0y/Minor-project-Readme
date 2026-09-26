import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Clock } from 'lucide-react';

export default function BuyingHistoryPage() {
  return (
    <div className="page-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/profile" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="page-header-simple">
        <h2 className="page-title">Buying History</h2>
        <p className="page-subtitle">Track your past purchases and orders on AgroTrade.</p>
      </div>

      <div className="empty-state">
        <Clock className="empty-state-icon" />
        <h3 className="empty-state-title">Buying History Placeholder</h3>
        <p className="empty-state-desc">
          The buying history and order tracking functionality will be provided in a future update.
        </p>
        <Link to="/buy" className="btn btn-primary">
          <ShoppingBag size={18} />
          <span>Browse Marketplace</span>
        </Link>
      </div>
    </div>
  );
}
