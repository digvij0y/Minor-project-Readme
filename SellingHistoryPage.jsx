import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { Tag, ArrowLeft, PlusCircle, AlertCircle, Calendar, Package } from 'lucide-react';

export default function SellingHistoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const defaultProductImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23e2e8f0'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Cpath d='M30 65l15-20 12 15 8-10 15 20H20z' fill='%2394a3b8'/%3E%3Ccircle cx='35' cy='35' r='8' fill='%23cbd5e1'/%3E%3C/svg%3E";

  useEffect(() => {
    async function fetchSellingHistory() {
      setLoading(true);
      setError('');
      try {
        const res = await productsApi.getSellingHistory();
        setProducts(res.products || []);
      } catch (err) {
        setError(err.message || 'Unable to load selling history.');
      } finally {
        setLoading(false);
      }
    }

    fetchSellingHistory();
  }, []);

  return (
    <div className="page-content">
      {/* Navigation header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/profile" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Profile</span>
        </Link>
        <Link to="/sell" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span>Register New Product</span>
        </Link>
      </div>

      <div className="page-header-simple">
        <h2 className="page-title">My Selling History</h2>
        <p className="page-subtitle">
          Agricultural products you have registered for sale on the AgroTrade marketplace.
        </p>
      </div>

      {loading ? (
        <div className="page-loader">
          <span className="spinner" style={{ width: '2rem', height: '2rem', borderColor: 'var(--primary)' }}></span>
          <p>Loading your registered products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <h3 className="empty-state-title">No products registered yet.</h3>
          <p className="empty-state-desc">
            You haven't listed any agricultural products for sale yet. Start selling now to reach buyers across the region.
          </p>
          <Link to="/sell" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Register Your First Product</span>
          </Link>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Showing <strong>{products.length}</strong> {products.length === 1 ? 'registered product' : 'registered products'}
          </p>

          <div className="products-grid">
            {products.map(product => (
              <div key={product.product_id} className="product-card">
                <div className="product-card-img-wrapper">
                  <img
                    src={product.product_image_url || defaultProductImage}
                    alt={product.product_name}
                    className="product-card-img"
                    onError={(e) => { e.target.src = defaultProductImage; }}
                  />
                  <span className="product-category-badge">
                    {product.product_type}
                  </span>
                </div>

                <div className="product-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 className="product-title">{product.product_name}</h4>
                    <span style={{
                      background: '#f0fdf4',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary-border)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase'
                    }}>
                      {product.status}
                    </span>
                  </div>

                  <p className="product-details-snippet">
                    {product.product_details || 'No additional details.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <Calendar size={13} />
                    <span>Listed: {new Date(product.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="product-card-footer">
                    <div className="product-price-tag">
                      <span className="product-price-amount">
                        ₹{product.price}
                      </span>
                      <span className="product-unit-info">
                        for {product.quantity} {product.unit} (₹{(product.price / product.quantity).toFixed(2)}/{product.unit})
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ID: {product.product_id.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
