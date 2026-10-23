import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, User, MapPin, Phone, Briefcase, Info, CheckCircle2 } from 'lucide-react';

export default function ProductDetailsModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  // Registered quantity & price from the database record
  const registeredQuantity = parseFloat(product.quantity) || 1;
  const registeredPrice = parseFloat(product.price) || 0;
  const unit = product.unit || 'kg';

  // Unit price = registeredPrice / registeredQuantity
  const unitPrice = registeredQuantity > 0 ? registeredPrice / registeredQuantity : 0;

  // DEFAULT QUANTITY MUST INITIALIZE TO SELLER'S REGISTERED QUANTITY (CRITICAL REQUIREMENT)
  const [selectedQuantity, setSelectedQuantity] = useState(registeredQuantity);
  const [orderMessage, setOrderMessage] = useState('');

  // When product changes, reset to registered quantity
  useEffect(() => {
    if (product) {
      setSelectedQuantity(parseFloat(product.quantity) || 1);
      setOrderMessage('');
    }
  }, [product]);

  // Selected dynamic price = unitPrice * selectedQuantity
  const calculatedPrice = Math.round((unitPrice * selectedQuantity) * 100) / 100;

  // Generate sensible quantity options up to registered quantity
  const generateQuantityOptions = () => {
    const options = [];
    const max = registeredQuantity;

    // Determine step size
    let step = 1;
    if (max <= 1) {
      step = 0.25;
    } else if (max <= 5) {
      step = 0.5;
    } else if (max <= 20) {
      step = 1;
    } else {
      step = Math.max(1, Math.floor(max / 10));
    }

    // Add decimal options if applicable
    if (step < 1) {
      for (let q = step; q < max; q += step) {
        options.push(parseFloat(q.toFixed(2)));
      }
    } else {
      // Add a half unit option if max >= 1 and unit allows decimals (kg, litre, tonne, quintal)
      if (['kg', 'litre', 'tonne', 'quintal'].includes(unit.toLowerCase()) && max >= 1) {
        if (!options.includes(0.5)) options.push(0.5);
      }
      for (let q = 1; q < max; q += step) {
        if (!options.includes(q)) options.push(q);
      }
    }

    // Always include registered quantity as the max option
    if (!options.includes(max)) {
      options.push(max);
    }

    options.sort((a, b) => a - b);
    return options;
  };

  const quantityOptions = generateQuantityOptions();

  const handleQuantitySelectChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      // Cannot exceed registered quantity
      const clamped = Math.min(val, registeredQuantity);
      setSelectedQuantity(clamped);
    }
  };

  const handleCustomQuantityInput = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val <= 0) {
      val = 0.1;
    }
    // Limit to available quantity
    if (val > registeredQuantity) {
      val = registeredQuantity;
    }
    setSelectedQuantity(val);
  };

  const handleOrderClick = () => {
    // Exact requirement: display "Order functionality will be added soon."
    setOrderMessage('Order functionality will be added soon.');
  };

  const defaultProductImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23e2e8f0'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Cpath d='M30 65l15-20 12 15 8-10 15 20H20z' fill='%2394a3b8'/%3E%3Ccircle cx='35' cy='35' r='8' fill='%23cbd5e1'/%3E%3C/svg%3E";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="brand-badge" style={{ textTransform: 'uppercase' }}>
              {product.product_type}
            </span>
            <h3 className="modal-title" style={{ marginTop: '4px' }}>
              {product.product_name}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) 1.2fr', gap: '1.75rem' }}>
            {/* Left: Product Image & Details */}
            <div>
              <div style={{
                width: '100%',
                height: '240px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <img
                  src={product.product_image_url || defaultProductImage}
                  alt={product.product_name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = defaultProductImage; }}
                />
              </div>

              {/* Seller Info Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.85rem'
              }}>
                <p style={{ fontWeight: 700, color: 'var(--text-sub)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="var(--primary)" />
                  <span>Seller Information</span>
                </p>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {product.seller_name || 'Verified Agro Seller'}
                </p>
                {product.seller_profession && (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={13} /> {product.seller_profession}
                  </p>
                )}
                {product.seller_address && (
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {product.seller_address}
                  </p>
                )}
                {product.seller_phone && (
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={13} /> {product.seller_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Pricing, Dynamic Calculation, Quantity, Order */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Product Description
                  </label>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', marginTop: '0.35rem', lineHeight: '1.5' }}>
                    {product.product_details || 'No additional details provided by the seller.'}
                  </p>
                </div>

                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid var(--primary-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered by Seller:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {registeredQuantity} {unit} for ₹{registeredPrice}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Base Unit Rate:</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ₹{unitPrice.toFixed(2)} / {unit}
                    </span>
                  </div>
                </div>

                {/* Quantity Dropdown Selection */}
                <div className="form-group">
                  <label className="form-label" htmlFor="qty-select">
                    Select Quantity ({unit})
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px' }}>
                      (Max available: {registeredQuantity} {unit})
                    </span>
                  </label>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <select
                      id="qty-select"
                      className="form-select"
                      value={selectedQuantity}
                      onChange={handleQuantitySelectChange}
                      style={{ flex: 1, fontWeight: 600 }}
                    >
                      {quantityOptions.map(q => (
                        <option key={q} value={q}>
                          {q} {unit} {q === registeredQuantity ? '(Full registered amount)' : ''}
                        </option>
                      ))}
                    </select>

                    {/* Numeric Input fallback for custom decimal amounts */}
                    <div style={{ width: '130px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max={registeredQuantity}
                        value={selectedQuantity}
                        onChange={handleCustomQuantityInput}
                        className="form-input"
                        title="Custom decimal quantity"
                        style={{ padding: '0.65rem 0.5rem', textAlign: 'center', fontWeight: 600 }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {unit}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    * Quantity cannot exceed the seller's available stock of {registeredQuantity} {unit}.
                  </p>
                </div>

                {/* Dynamic Price Display */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid var(--primary-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                      Total Selected Price:
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({selectedQuantity} {unit} × ₹{unitPrice.toFixed(2)}/{unit})
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{calculatedPrice}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      INR
                    </span>
                  </div>
                </div>

                {/* Order message notice */}
                {orderMessage && (
                  <div className="alert alert-success" style={{ marginTop: '1rem', animation: 'fadeIn 0.2s ease' }}>
                    <Info size={18} />
                    <span style={{ fontWeight: 600 }}>{orderMessage}</span>
                  </div>
                )}
              </div>

              {/* Order Button */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  style={{ flex: 1 }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOrderClick}
                  style={{ flex: 2, padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                >
                  <ShoppingCart size={18} />
                  <span>ORDER</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
