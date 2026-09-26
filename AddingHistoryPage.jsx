import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, History } from 'lucide-react';

export default function AddingHistoryPage() {
  return (
    <div className="page-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/profile" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Profile</span>
        </Link>
      </div>

      <div className="page-header-simple">
        <h2 className="page-title">Adding History</h2>
        <p className="page-subtitle">Records of additions and listings.</p>
      </div>

      <div className="empty-state">
        <History className="empty-state-icon" />
        <h3 className="empty-state-title">Adding History Placeholder</h3>
        <p className="empty-state-desc">
          Detailed functionality for the Adding History page will be provided in a future update.
        </p>
        <Link to="/profile" className="btn btn-primary">
          <span>Return to Profile</span>
        </Link>
      </div>
    </div>
  );
}
