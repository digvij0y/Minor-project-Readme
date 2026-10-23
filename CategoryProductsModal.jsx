import React, { useState } from 'react';
import { X, User, ChevronRight, Package, ArrowLeft } from 'lucide-react';

export default function CategoryProductsModal({
  categoryName,
  products,
  isOpen,
  onClose,
  onSelectProduct
}) {
  const [selectedProductName, setSelectedProductName] = useState(null);

  if (!isOpen) return null;

  const defaultProductImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23e2e8f0'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Cpath d='M30 65l15-20 12 15 8-10 15 20H20z' fill='%2394a3b8'/%3E%3Ccircle cx='35' cy='35' r='8' fill='%23cbd5e1'/%3E%3C/svg%3E";

  // Filter products by selected category
  const filteredProducts = products.filter(p => {
    if (!categoryName || categoryName.toLowerCase() === 'all') return true;
    return p.product_type.toLowerCase() === categoryName.toLowerCase();
  });

  // Group products by lowercase product_name for multiple-seller discovery
  const productGroups = {};
  filteredProducts.forEach(p => {
    const key = p.product_name.trim().toLowerCase();
    if (!productGroups[key]) {
      productGroups[key] = {
        name: p.product_name.trim(),
        category: p.product_type,
        listings: []
      };
    }
    productGroups[key].listings.push(p);
  });

  const productKeys = Object.keys(productGroups);

  // If a specific product name is selected, show only listings for that product
  const activeGroup = selectedProductName ? productGroups[selectedProductName] : null;

  const handleListingClick = (listing) => {
    onSelectProduct(listing);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {selectedProductName && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedProductName(null)}
                style={{ padding: '0.35rem 0.65rem' }}
                title="Back to all category items"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <span className="brand-badge" style={{ textTransform: 'uppercase' }}>
                {categoryName || 'Marketplace'}
              </span>
              <h3 className="modal-title" style={{ marginTop: '2px' }}>
                {selectedProductName
                  ? `Sellers for "${activeGroup?.name}"`
                  : `Available ${categoryName ? categoryName.toUpperCase() : ''} Products`}
              </h3>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <Package className="empty-state-icon" />
              <h4 className="empty-state-title">No products are currently available in this category.</h4>
              <p className="empty-state-desc">Check back later or register a product from the SELL page.</p>
            </div>
          ) : selectedProductName && activeGroup ? (
            /* MULTIPLE SELLER VIEW: All seller listings for the selected product name */
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Found <strong>{activeGroup.listings.length}</strong> seller {activeGroup.listings.length === 1 ? 'listing' : 'listings'} for <strong>{activeGroup.name}</strong>. Select a seller to view details and order.
              </p>

              <div className="seller-listings-list">
                {activeGroup.listings.map((item) => (
                  <div
                    key={item.product_id}
                    className="seller-listing-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleListingClick(item)}
                  >
                    <div className="seller-listing-info">
                      <img
                        src={item.product_image_url || defaultProductImage}
                        alt={item.product_name}
                        className="seller-listing-thumb"
                        onError={(e) => { e.target.src = defaultProductImage; }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                            {item.product_name}
                          </span>
                          <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                            ID: {item.product_id.slice(-6)}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={14} color="var(--primary)" />
                          <span>Seller: <strong>{item.seller_name || 'Verified Seller'}</strong></span>
                          {item.seller_address && <span style={{ color: 'var(--text-muted)' }}>• {item.seller_address}</span>}
                        </p>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '450px' }}>
                          {item.product_details || 'Fresh harvest available.'}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{item.price}
                        </span>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          for {item.quantity} {item.unit}
                        </span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          (₹{(item.price / item.quantity).toFixed(2)}/{item.unit})
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleListingClick(item);
                        }}
                      >
                        <span>Select Seller</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* OVERVIEW: Distinct products with count of sellers or direct listing */
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Browse products or click any product to compare all seller listings:
              </p>

              <div className="products-grid">
                {productKeys.map(key => {
                  const grp = productGroups[key];
                  const firstListing = grp.listings[0];
                  const hasMultipleSellers = grp.listings.length > 1;

                  return (
                    <div
                      key={key}
                      className="product-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (hasMultipleSellers) {
                          setSelectedProductName(key);
                        } else {
                          handleListingClick(firstListing);
                        }
                      }}
                    >
                      <div className="product-card-img-wrapper">
                        <img
                          src={firstListing.product_image_url || defaultProductImage}
                          alt={grp.name}
                          className="product-card-img"
                          onError={(e) => { e.target.src = defaultProductImage; }}
                        />
                        <span className="product-category-badge">
                          {grp.category}
                        </span>
                      </div>

                      <div className="product-card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <h4 className="product-title">{grp.name}</h4>
                          {hasMultipleSellers ? (
                            <span style={{
                              background: '#eff6ff',
                              color: '#2563eb',
                              border: '1px solid #bfdbfe',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              whiteSpace: 'nowrap'
                            }}>
                              {grp.listings.length} Sellers
                            </span>
                          ) : (
                            <span style={{
                              background: '#f8fafc',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '9999px'
                            }}>
                              1 Seller
                            </span>
                          )}
                        </div>

                        <p className="product-details-snippet">
                          {firstListing.product_details || 'High quality harvest.'}
                        </p>

                        <div className="product-card-footer">
                          <div className="product-price-tag">
                            <span className="product-price-amount">
                              ₹{firstListing.price}
                            </span>
                            <span className="product-unit-info">
                              for {firstListing.quantity} {firstListing.unit}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (hasMultipleSellers) {
                                setSelectedProductName(key);
                              } else {
                                handleListingClick(firstListing);
                              }
                            }}
                          >
                            <span>{hasMultipleSellers ? 'View Sellers' : 'Details'}</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
