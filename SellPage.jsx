import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../services/api';
import {
  Tag, Upload, CheckCircle2, AlertCircle, ArrowLeft, Image as ImageIcon,
  IndianRupee, Package, Layers
} from 'lucide-react';

const CATEGORIES = [
  { id: 'seeds', label: 'Seeds' },
  { id: 'grain', label: 'Grain' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'others', label: 'Others' }
];

const UNITS = [
  { id: 'kg', label: 'kg (Kilogram)' },
  { id: 'gram', label: 'gram (Gram)' },
  { id: 'quintal', label: 'quintal (Quintal)' },
  { id: 'tonne', label: 'tonne (Tonne)' },
  { id: 'litre', label: 'litre (Litre)' },
  { id: 'piece', label: 'piece (Piece)' }
];

export default function SellPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: '',
    product_type: 'vegetables',
    quantity: '',
    unit: 'kg',
    price: '',
    product_details: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const validate = () => {
    const errs = {};

    if (!formData.product_name.trim()) {
      errs.product_name = 'Product name is required.';
    }

    if (!formData.product_type) {
      errs.product_type = 'Please select a product category.';
    }

    const qty = parseFloat(formData.quantity);
    if (!formData.quantity || isNaN(qty) || qty <= 0) {
      errs.quantity = 'Please enter a valid quantity greater than zero.';
    }

    if (!formData.unit) {
      errs.unit = 'Please select a measurement unit.';
    }

    const prc = parseFloat(formData.price);
    if (!formData.price || isNaN(prc) || prc <= 0) {
      errs.price = 'Please enter a valid price in INR greater than zero.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleImageChange = (e) => {
    setServerError('');
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setServerError('Please select a JPG, JPEG, PNG, or WEBP image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerError('Image size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setServerSuccess('');

    try {
      const data = new FormData();
      data.append('product_name', formData.product_name.trim());
      data.append('product_type', formData.product_type.toLowerCase());
      data.append('quantity', formData.quantity);
      data.append('unit', formData.unit.toLowerCase());
      data.append('price', formData.price);
      data.append('product_details', formData.product_details.trim());

      if (imageFile) {
        data.append('product_image', imageFile);
      }

      await productsApi.registerProduct(data);

      setServerSuccess('Product registered successfully.');

      // Reset form
      setFormData({
        product_name: '',
        product_type: 'vegetables',
        quantity: '',
        unit: 'kg',
        price: '',
        product_details: ''
      });
      setImageFile(null);
      setImagePreview(null);

      // Offer immediate redirect to selling history or buy page
      setTimeout(() => {
        navigate('/selling-history');
      }, 1400);
    } catch (err) {
      setServerError(err.message || 'Unable to register product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* Top Navigation */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/home" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <Link to="/selling-history" className="btn btn-outline-primary btn-sm">
          <Tag size={16} />
          <span>View My Selling History</span>
        </Link>
      </div>

      <div className="page-header-simple">
        <h2 className="page-title">Register Product for Sell</h2>
        <p className="page-subtitle">
          List your agricultural harvest, seeds, grain, or produce on the AgroTrade marketplace.
        </p>
      </div>

      <div className="form-card" style={{ maxWidth: '640px' }}>
        {serverError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {serverSuccess && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{serverSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Product Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="product_name">
              Product Name <span className="req">*</span>
            </label>
            <input
              id="product_name"
              name="product_name"
              type="text"
              className={`form-input ${errors.product_name ? 'error' : ''}`}
              placeholder="e.g. Wheat, Tomato, Basmati Rice"
              value={formData.product_name}
              onChange={handleInputChange}
              disabled={loading}
            />
            {errors.product_name && <p className="field-error-text">{errors.product_name}</p>}
          </div>

          {/* Product Type / Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="product_type">
              Product Category / Type <span className="req">*</span>
            </label>
            <select
              id="product_type"
              name="product_type"
              className={`form-select ${errors.product_type ? 'error' : ''}`}
              value={formData.product_type}
              onChange={handleInputChange}
              disabled={loading}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            {errors.product_type && <p className="field-error-text">{errors.product_type}</p>}
          </div>

          {/* Quantity & Unit */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">
                Available Quantity <span className="req">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="any"
                min="0.01"
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                placeholder="e.g. 2, 5, 10"
                value={formData.quantity}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.quantity && <p className="field-error-text">{errors.quantity}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="unit">
                Unit of Measurement <span className="req">*</span>
              </label>
              <select
                id="unit"
                name="unit"
                className={`form-select ${errors.unit ? 'error' : ''}`}
                value={formData.unit}
                onChange={handleInputChange}
                disabled={loading}
              >
                {UNITS.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
              {errors.unit && <p className="field-error-text">{errors.unit}</p>}
            </div>
          </div>

          {/* Product Price */}
          <div className="form-group">
            <label className="form-label" htmlFor="price">
              Total Price (INR ₹) <span className="req">*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                fontSize: '1.1rem'
              }}>
                ₹
              </span>
              <input
                id="price"
                name="price"
                type="number"
                step="any"
                min="1"
                style={{ paddingLeft: '2.5rem' }}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="e.g. 100, 225, 500"
                value={formData.price}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            {errors.price && <p className="field-error-text">{errors.price}</p>}
            {formData.quantity && formData.price && !isNaN(formData.quantity) && !isNaN(formData.price) && parseFloat(formData.quantity) > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                Effective unit rate: ₹{(parseFloat(formData.price) / parseFloat(formData.quantity)).toFixed(2)} per {formData.unit}
              </p>
            )}
          </div>

          {/* Product Details (Textarea) */}
          <div className="form-group">
            <label className="form-label" htmlFor="product_details">
              Product Details & Description
            </label>
            <textarea
              id="product_details"
              name="product_details"
              rows="3"
              className="form-textarea"
              placeholder="e.g. Fresh wheat harvested recently. Good quality and suitable for food use."
              value={formData.product_details}
              onChange={handleInputChange}
              disabled={loading}
            ></textarea>
          </div>

          {/* Product Image Upload */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <div className="upload-dropzone">
              <input
                type="file"
                id="product_image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={loading}
              />
              <label htmlFor="product_image" style={{ cursor: 'pointer', display: 'block' }}>
                <ImageIcon size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {imageFile ? 'Click to change product image' : 'Click to upload product image'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  JPG, JPEG, PNG, or WEBP up to 5MB
                </p>
              </label>

              {imagePreview && (
                <div className="upload-preview-box">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="upload-preview-img"
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={handleRemoveImage}
                      disabled={loading}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Registering product...</span>
                </>
              ) : (
                <>
                  <Tag size={20} />
                  <span>REGISTER PRODUCT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
