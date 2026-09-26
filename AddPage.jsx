import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Layers } from 'lucide-react';

export default function AddPage() {
  return (
    <div className="page-content">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/home" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="page-header-simple">
        <h2 className="page-title">ADD</h2>
        <p className="page-subtitle">Add features and product entries to AgroTrade.</p>
      </div>

      <div className="empty-state">
        <Layers className="empty-state-icon" />
        <h3 className="empty-state-title">ADD Page Placeholder</h3>
        <p className="empty-state-desc">
          Detailed functionality for the ADD page will be provided in a future update.
        </p>
        <Link to="/home" className="btn btn-primary">
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
