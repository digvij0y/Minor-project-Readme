import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import {
  ShoppingBag, Search, Tag, ArrowLeft, RefreshCw, AlertCircle,
  Package, ChevronRight, User, Filter
} from 'lucide-react';
import CategoryProductsModal from '../components/CategoryProductsModal';
import ProductDetailsModal from '../components/ProductDetailsModal';

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'seeds', label: 'SEEDS' },
  { id: 'grain', label: 'GRAIN' },
  { id: 'vegetables', label: 'VEGETABLES' },
  { id: 'fruits', label: 'FRUITS' },
  { id: 'others', label: 'OTHERS' }
];

export default function BuyPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Modals state
  const [categoryModalCategory, setCategoryModalCategory] = useState(null);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);

  const defaultProductImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23e2e8f0'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Cpath d='M30 65l15-20 12 15 8-10 15 20H20z' fill='%2394a3b8'/%3E%3Ccircle cx='35' cy='35' r='8' fill='%23cbd5e1'/%3E%3C/svg%3E";

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productsApi.getAllProducts();
      setProducts(res.products || []);
    } catch (err) {
      setError(err.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Category Pill Click Handler
  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      // Show all currently available products in the main view
      setCategoryModalCategory(null);
    } else {
      // Requirements: When user clicks SEEDS/GRAIN/VEGETABLES/FRUITS/OTHERS -> Open popup containing available products in that category
      setCategoryModalCategory(catId);
    }
  };

  // Filter products by search and category for main view
  const displayedProducts = products.filter(p => {
    const matchesSearch = searchQuery.trim() === '' ||
      p.product_name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(searchQuery.trim().toLowerCase()));

    const matchesCategory = activeCategory === 'all' || p.product_type.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Group products by product_name to highlight multiple sellers in main view
  const groupedProducts = {};
  displayedProducts.forEach(p => {
    const key = p.product_name.trim().toLowerCase();
    if (!groupedProducts[key]) {
      groupedProducts[key] = {
        name: p.product_name.trim(),
        category: p.product_type,
        listings: []
      };
    }
    groupedProducts[key].listings.push(p);
  });

  const groupedKeys = Object.keys(groupedProducts);

  return (
    <div className="page-content">
      {/* Top back navigation */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/home" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <button onClick={fetchProducts} className="btn btn-secondary btn-sm" title="Refresh products">
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="page-header-simple">
        <h2 className="page-title">Agricultural Marketplace</h2>
        <p className="page-subtitle">
          Browse verified harvests and produce registered directly by farmers and suppliers.
        </p>
      </div>

      {/* Categories Bar: ALL, SEEDS, GRAIN, VEGETABLES, FRUITS, OTHERS */}
      <div className="category-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '480px', margin: '0 auto 2rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)' }}
          placeholder="Search products by name or seller..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Content State */}
      {loading ? (
        <div className="page-loader">
          <span className="spinner" style={{ width: '2rem', height: '2rem', borderColor: 'var(--primary)' }}></span>
          <p>Loading products from marketplace database...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <h3 className="empty-state-title">No products are currently available.</h3>
          <p className="empty-state-desc">
            There are currently no products registered for sale. Be the first to register a product!
          </p>
          <Link to="/sell" className="btn btn-primary">
            <Tag size={18} />
            <span>Register a Product on SELL</span>
          </Link>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <h3 className="empty-state-title">No products found matching your search.</h3>
          <p className="empty-state-desc">Try clearing your search query or selecting ALL categories.</p>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing <strong>{displayedProducts.length}</strong> available {displayedProducts.length === 1 ? 'seller listing' : 'seller listings'} across <strong>{groupedKeys.length}</strong> {groupedKeys.length === 1 ? 'product' : 'distinct products'}
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any product to compare seller prices
            </span>
          </div>

          {/* Product Cards Grid: Every seller listing is distinct and clickable */}
          <div className="products-grid">
            {displayedProducts.map(product => (
              <div
                key={product.product_id}
                className="product-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProductForDetails(product)}
              >
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
                    <span style={{ fontSize: '0.72rem', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                      ID: {product.product_id.slice(-6)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="var(--primary)" />
                    <span>Seller: <strong>{product.seller_name || 'Verified Farmer'}</strong></span>
                  </p>

                  <p className="product-details-snippet">
                    {product.product_details || 'Fresh quality harvest.'}
                  </p>

                  <div className="product-card-footer">
                    <div className="product-price-tag">
                      <span className="product-price-amount">
                        ₹{product.price}
                      </span>
                      <span className="product-unit-info">
                        for {product.quantity} {product.unit} (₹{(product.price / product.quantity).toFixed(2)}/{product.unit})
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductForDetails(product);
                      }}
                    >
                      <span>Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Popup Modal (SEEDS, GRAIN, VEGETABLES, FRUITS, OTHERS) */}
      <CategoryProductsModal
        categoryName={categoryModalCategory}
        products={products}
        isOpen={!!categoryModalCategory}
        onClose={() => setCategoryModalCategory(null)}
        onSelectProduct={(prod) => {
          setSelectedProductForDetails(prod);
        }}
      />

      {/* Product Details Popup Modal */}
      <ProductDetailsModal
        product={selectedProductForDetails}
        isOpen={!!selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
      />
    </div>
  );
}
