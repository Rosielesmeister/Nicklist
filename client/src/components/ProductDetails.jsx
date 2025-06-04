import React, { useState } from "react";
import { Modal, Button, Row, Col, Badge, Carousel, Alert, Spinner } from "react-bootstrap";
import { Heart, Mail, MapPin, Calendar, User, Shield } from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";

// You might want to import your favorites API here in the future

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const UI_CONFIG = {
  IMAGE_HEIGHT: "400px",
  THUMBNAIL_SIZE: "60px",
  MODAL_SIZE: "lg",
};

const CONTACT_TEMPLATE = {
  subject: (productName) => `Interested in: ${productName}`,
  body: (productName, price) => 
    `Hi,\n\nI'm interested in your listing "${productName}" for ${price}.\n\nPlease let me know if it's still available.\n\nThanks!`,
};

const SAFETY_MESSAGE = "Meet in a public place when buying/selling items. Never send money or personal information before meeting the seller.";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Format price as currency
const formatPrice = (price) => {
  if (!price && price !== 0) return "Price not available";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Format date in readable format
const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ProductDetailsModal = ({ show, onHide, product }) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  const [imageIndex, setImageIndex] = useState(0);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

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
        CONTACT_TEMPLATE.body(product.name, formatPrice(product.price))
      );

      window.location.href = `mailto:${product.contactEmail}?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error("Error creating mailto link:", error);
      alert("Unable to open email client. Please contact the seller directly at: " + product.contactEmail);
    }
  };

  // Handle add to favorites
  const handleAddToFavorites = async () => {
    if (!product?._id) {
      alert("Unable to add to favorites - product information is missing");
      return;
    }

    setAddingToFavorites(true);

    try {
      // TODO: Implement actual favorites API call
      // await favoritesAPI.addToFavorites(product._id);
      
      // For now, just simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Add to favorites:", product._id);
      alert("Added to favorites! (This is a demo - implement favoritesAPI for real functionality)");
      
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Failed to add to favorites. Please try again.");
    } finally {
      setAddingToFavorites(false);
    }
  };

  // Handle modal close with state reset
  const handleClose = () => {
    setImageIndex(0);
    setAddingToFavorites(false);
    onHide();
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setImageIndex(index);
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Image gallery component
  const ImageGallery = () => {
    if (!product.images || product.images.length === 0) {
      return (
        <div
          className="d-flex align-items-center justify-content-center bg-light rounded"
          style={{ height: UI_CONFIG.IMAGE_HEIGHT }}
        >
          <div className="text-center text-muted">
            <i className="fas fa-image fa-3x mb-2"></i>
            <p>No images available</p>
          </div>
        </div>
      );
    }

    // Single image display
    if (product.images.length === 1) {
      return (
        <img
          src={product.images[0].url}
          alt={product.name}
          className="img-fluid rounded"
          style={{ 
            width: "100%", 
            maxHeight: UI_CONFIG.IMAGE_HEIGHT, 
            objectFit: "cover" 
          }}
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==";
          }}
        />
      );
    }

    // Multiple images with carousel
    return (
      <div className="product-images">
        <Carousel
          activeIndex={imageIndex}
          onSelect={setImageIndex}
          indicators={true}
          controls={true}
          interval={null} // Disable auto-advance
        >
          {product.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                src={image.url}
                alt={`${product.name} ${index + 1}`}
                className="d-block w-100 rounded"
                style={{ height: UI_CONFIG.IMAGE_HEIGHT, objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Thumbnail navigation */}
        <div className="d-flex gap-2 mt-2 justify-content-center flex-wrap">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className={`img-thumbnail ${
                index === imageIndex ? "border-primary border-2" : ""
              }`}
              style={{
                width: UI_CONFIG.THUMBNAIL_SIZE,
                height: UI_CONFIG.THUMBNAIL_SIZE,
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => handleThumbnailClick(index)}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Product information section
  const ProductInfo = () => (
    <div className="product-info">
      {/* Price */}
      <div className="mb-3">
        <h2 className="text-success mb-0">{formatPrice(product.price)}</h2>
      </div>

      {/* Category and Status */}
      <div className="mb-3">
        <Badge bg="primary" className="me-2">
          {product.category || "Uncategorized"}
        </Badge>
        <Badge bg={product.isActive ? "success" : "secondary"}>
          {product.isActive ? "Available" : "Not Available"}
        </Badge>
      </div>

      {/* Description */}
      <div className="mb-3">
        <h5>Description</h5>
        <p className="text-muted">
          {product.description || "No description available"}
        </p>
      </div>
    </div>
  );

  // Product details section
  const ProductDetails = () => (
    <div className="mb-3">
      <h5>Details</h5>
      <Row className="g-2">
        <Col sm={6}>
          <div className="d-flex align-items-center mb-2">
            <MapPin size={16} className="me-2 text-muted" />
            <div>
              <strong>Location:</strong>
              <p className="mb-0 text-muted">
                {product.city && product.state 
                  ? `${product.city}, ${product.state}` 
                  : "Location not specified"}
              </p>
            </div>
          </div>
        </Col>
        <Col sm={6}>
          <div className="d-flex align-items-center mb-2">
            <MapPin size={16} className="me-2 text-muted" />
            <div>
              <strong>Region:</strong>
              <p className="mb-0 text-muted">{product.region || "Not specified"}</p>
            </div>
          </div>
        </Col>
        <Col sm={6}>
          <div className="d-flex align-items-center mb-2">
            <Calendar size={16} className="me-2 text-muted" />
            <div>
              <strong>Posted:</strong>
              <p className="mb-0 text-muted">{formatDate(product.createdAt)}</p>
            </div>
          </div>
        </Col>
        <Col sm={6}>
          <div className="d-flex align-items-center mb-2">
            <Calendar size={16} className="me-2 text-muted" />
            <div>
              <strong>Updated:</strong>
              <p className="mb-0 text-muted">{formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  // Seller information section
  const SellerInfo = () => (
    <div className="mb-3">
      <h5 className="d-flex align-items-center">
        <User size={18} className="me-2" />
        Seller Information
      </h5>
      <div className="ps-4">
        <p className="mb-1">
          <strong>Contact:</strong> {product.contactEmail || "Not provided"}
        </p>
        {product.user && (
          <p className="mb-1">
            <strong>Seller ID:</strong> {typeof product.user === 'object' ? product.user._id : product.user}
          </p>
        )}
      </div>
    </div>
  );

  // Action buttons section
  const ActionButtons = () => (
    <div className="d-grid gap-2">
      <Button
        variant="success"
        size="lg"
        onClick={handleContactSeller}
        disabled={!product.isActive || !product.contactEmail}
      >
        <Mail size={18} className="me-2" />
        Contact Seller
      </Button>

      <Button
        variant="outline-primary"
        onClick={handleAddToFavorites}
        disabled={addingToFavorites}
      >
        {addingToFavorites ? (
          <>
            <Spinner size="sm" className="me-2" />
            Adding to Favorites...
          </>
        ) : (
          <>
            <Heart size={18} className="me-2" />
            Save to Favorites
          </>
        )}
      </Button>
    </div>
  );

  // Safety notice component
  const SafetyNotice = () => (
    <Alert variant="warning" className="mt-3">
      <div className="d-flex align-items-start">
        <Shield size={18} className="me-2 mt-1 flex-shrink-0" />
        <div>
          <strong>Safety Tip:</strong> {SAFETY_MESSAGE}
        </div>
      </div>
    </Alert>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  // Don't render if no product provided
  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose} size={UI_CONFIG.MODAL_SIZE} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-truncate">
          {product.name || "Product Details"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          {/* Images Section */}
          <Col md={6}>
            <ImageGallery />
          </Col>

          {/* Product Info Section */}
          <Col md={6}>
            <ProductInfo />
            <ProductDetails />
            <SellerInfo />
            <ActionButtons />
            <SafetyNotice />
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailsModal;