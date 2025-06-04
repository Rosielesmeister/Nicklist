import React, { useState } from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { MessageCircle, ShoppingBag, MapPin, Calendar, Mail } from "lucide-react";
import FavoriteButton from './FavoriteButton';
import BuyNowModal from './BuyNowModal';
import { useAuth } from "../hooks/UseAuth";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const UI_CONFIG = {
  MAIN_IMAGE_HEIGHT: '300px',
  THUMBNAIL_SIZE: '60px',
  MODAL_SIZE: 'lg',
  BORDER_RADIUS: '8px',
  THUMBNAIL_BORDER_RADIUS: '4px',
};

const CONTACT_TEMPLATE = {
  subject: (productName) => `Interested in: ${productName}`,
  body: (productName, price) => 
    `Hi,\n\nI'm interested in your listing "${productName}" priced at $${price}.\n\nPlease let me know if it's still available.\n\nThanks!`,
};

const DEFAULT_STYLES = {
  imageContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: UI_CONFIG.BORDER_RADIUS,
    overflow: 'hidden',
  },
  noImageContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: UI_CONFIG.BORDER_RADIUS,
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Format date in readable format
const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Format price with proper fallback
const formatPrice = (price) => {
  if (!price && price !== 0) return "Price not available";
  return price.toLocaleString();
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ProductDetailsModal = ({ show, onHide, product }) => {
  const { user } = useAuth();
  
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  // Check user relationship to product
  const getUserRelationship = () => {
    if (!user) return { isLoggedIn: false, isOwner: false };
    
    const isOwner = product?.user === user._id || product?.user?._id === user._id;
    return { isLoggedIn: true, isOwner };
  };

  const { isLoggedIn, isOwner } = getUserRelationship();
  const isAvailableForPurchase = product?.isActive && !isOwner;

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  // Handle contact seller via email
  const handleContactSeller = () => {
    if (!product?.contactEmail) {
      alert("Seller contact information is not available");
      return;
    }

    try {
      const subject = encodeURIComponent(CONTACT_TEMPLATE.subject(product.name));
      const body = encodeURIComponent(
        CONTACT_TEMPLATE.body(product.name, product.price)
      );

      window.location.href = `mailto:${product.contactEmail}?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error("Error creating mailto link:", error);
      alert("Unable to open email client. Please contact the seller directly at: " + product.contactEmail);
    }
  };

  // Handle buy now button
  const handleBuyNow = (e) => {
    e?.stopPropagation();
    
    if (!isLoggedIn) {
      alert("Please log in to purchase items");
      return;
    }

    if (isOwner) {
      alert("You cannot purchase your own product");
      return;
    }

    if (!product?.isActive) {
      alert("This item is no longer available");
      return;
    }

    setShowBuyModal(true);
  };

  // Handle successful order
  const handleOrderComplete = (order) => {
    console.log("Order completed:", order);
    setShowBuyModal(false);
    // Could refresh product list or show success message
    // Could also mark product as sold if it's a one-time item
  };

  // Handle modal close with state reset
  const handleClose = () => {
    setActiveImageIndex(0);
    setShowBuyModal(false);
    onHide();
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Modal header with status and favorite button
  const ModalHeader = () => (
    <Modal.Header closeButton className="border-0 pb-0">
      <div className="d-flex justify-content-between align-items-center w-100 me-3">
        <Badge bg={product?.isActive ? 'success' : 'secondary'}>
          {product?.isActive ? 'Available' : 'Sold'}
        </Badge>
        <FavoriteButton productId={product?._id} size="sm" />
      </div>
    </Modal.Header>
  );

  // Image gallery component
  const ImageGallery = () => {
    if (!product?.images || product.images.length === 0) {
      return (
        <div 
          style={{ 
            height: UI_CONFIG.MAIN_IMAGE_HEIGHT, 
            ...DEFAULT_STYLES.noImageContainer
          }}
          className="d-flex align-items-center justify-content-center mb-3"
        >
          <span className="text-muted fs-1">📷</span>
        </div>
      );
    }

    return (
      <>
        {/* Main Image Display */}
        <div 
          style={{ 
            height: UI_CONFIG.MAIN_IMAGE_HEIGHT, 
            ...DEFAULT_STYLES.imageContainer
          }}
          className="mb-3"
        >
          <img 
            src={product.images[activeImageIndex]?.url} 
            alt={product.name || "Product image"}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==";
            }}
          />
        </div>
        
        {/* Image Thumbnails */}
        {product.images.length > 1 && (
          <div className="d-flex gap-2 overflow-auto">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`${product.name} ${index + 1}`}
                style={{
                  width: UI_CONFIG.THUMBNAIL_SIZE,
                  height: UI_CONFIG.THUMBNAIL_SIZE,
                  objectFit: 'cover',
                  borderRadius: UI_CONFIG.THUMBNAIL_BORDER_RADIUS,
                  cursor: 'pointer',
                  border: activeImageIndex === index ? '2px solid #0d6efd' : '2px solid transparent'
                }}
                onClick={() => handleThumbnailClick(index)}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  // Product basic information
  const ProductBasicInfo = () => (
    <div className="mb-3">
      <h4 className="mb-2">{product?.name || "Product name not available"}</h4>
      <h3 className="text-primary mb-3">${formatPrice(product?.price)}</h3>
    </div>
  );

  // Product badges (category, region)
  const ProductBadges = () => (
    <div className="mb-3">
      <Badge bg="primary" className="me-2 mb-2">
        {product?.category || "Uncategorized"}
      </Badge>
      <Badge bg="secondary" className="me-2 mb-2">
        {product?.region || "No region"}
      </Badge>
    </div>
  );

  // Location information
  const LocationInfo = () => (
    <div className="mb-3">
      <div className="d-flex align-items-center">
        <MapPin size={16} className="me-2 text-muted" />
        <strong>Location:</strong>
      </div>
      <div className="text-muted ms-4">
        {product?.city && product?.state 
          ? `${product.city}, ${product.state}` 
          : "Location not specified"}
      </div>
    </div>
  );

  // Product description
  const ProductDescription = () => (
    <div className="mb-3">
      <strong>Description:</strong>
      <p className="mt-2 text-muted">
        {product?.description || "No description available"}
      </p>
    </div>
  );

  // Posted date information
  const PostedDate = () => (
    <div className="mb-3">
      <div className="d-flex align-items-center">
        <Calendar size={16} className="me-2 text-muted" />
        <strong>Posted:</strong>
      </div>
      <div className="text-muted ms-4">
        {formatDate(product?.createdAt)}
      </div>
    </div>
  );

  // Buy now button
  const BuyNowButton = () => (
    <div className="mb-3">
      <Button
        variant="success"
        size="lg"
        onClick={handleBuyNow}
        disabled={!isAvailableForPurchase}
        className="d-flex align-items-center justify-content-center w-100"
      >
        <ShoppingBag size={16} className="me-2" />
        {!product?.isActive ? "Sold Out" : "Buy Now"}
      </Button>
    </div>
  );

  // Contact information
  const ContactInfo = () => (
    <div className="mb-3">
      <div className="d-flex align-items-center">
        <Mail size={16} className="me-2 text-muted" />
        <strong>Contact:</strong>
      </div>
      <div className="text-muted ms-4">
        {product?.contactEmail || "Contact not available"}
      </div>
    </div>
  );

  // Modal footer with action buttons
  const ModalFooter = () => (
    <Modal.Footer className="border-0 pt-0">
      <div className="d-flex gap-2 w-100">
        <Button 
          variant="secondary" 
          onClick={handleClose}
          className="flex-shrink-0"
        >
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleContactSeller}
          className="flex-grow-1"
          disabled={!product?.isActive || !product?.contactEmail}
        >
          {product?.isActive ? (
            <>
              <Mail size={16} className="me-2" />
              Contact Seller
            </>
          ) : (
            'Item Sold'
          )}
        </Button>
      </div>
    </Modal.Footer>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  // Don't render if no product provided
  if (!product) return null;

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleClose} 
        size={UI_CONFIG.MODAL_SIZE} 
        centered
        className="product-details-modal"
      >
        <ModalHeader />

        <Modal.Body className="pt-0">
          <Row>
            {/* Image Section */}
            <Col md={6} className="mb-4">
              <ImageGallery />
            </Col>

            {/* Product Info Section */}
            <Col md={6}>
              <ProductBasicInfo />
              <ProductBadges />
              <LocationInfo />
              <ProductDescription />
              <PostedDate />
              <BuyNowButton />
              <ContactInfo />
            </Col>
          </Row>
        </Modal.Body>

        <ModalFooter />
      </Modal>

      {/* Buy Now Modal */}
      <BuyNowModal
        show={showBuyModal}
        onHide={() => setShowBuyModal(false)}
        product={product}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
};

export default ProductDetailsModal;