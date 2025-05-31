// components/ProductDetailsModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Badge, Row, Col, Carousel } from 'react-bootstrap';
import FavoriteButton from './FavoriteButton';
import BuyNowModal from './BuyNowModal';
import { useAuth } from "../hooks/useAuth";
import { MessageCircle, ShoppingBag } from "lucide-react";


const ProductDetailsModal = ({ show, onHide, product }) => {
    
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showBuyModal, setShowBuyModal] = useState(false); 
    const { user } = useAuth();
    

    if (!product) return null;

    const handleContactSeller = () => {
        // Create mailto link
        const subject = encodeURIComponent(`Interested in: ${product.name}`);
        const body = encodeURIComponent(
            `Hi,\n\nI'm interested in your listing "${product.name}" priced at $${product.price}.\n\nPlease let me know if it's still available.\n\nThanks!`
        );
        window.location.href = `mailto:${product.contactEmail}?subject=${subject}&body=${body}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const handleOrderComplete = (order) => {
        console.log("Order completed:", order);
        // You might want to refresh the product list or show a success message
        // You could also mark the product as sold if it's a one-time item
      };
    
      const handleBuyNow = (e) => {
        e.stopPropagation();
        
        if (!user) {
          alert("Please log in to purchase items");
          return;
        }
    
        if (isOwnProduct) {
          alert("You cannot purchase your own product");
          return;
        }
    
        if (!product.isActive) {
          alert("This item is no longer available");
          return;
        }
    
        setShowBuyModal(true);
      };
    
  // Check if user owns this product
  const isOwnProduct = user && (product.user === user._id || product.user?._id === user._id);

  // Check if product is available for purchase

      const isAvailableForPurchase = product.isActive && !isOwnProduct;


    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="lg" 
            centered
            className="product-details-modal"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <Badge bg={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Available' : 'Sold'}
                    </Badge>
                    <FavoriteButton productId={product._id} size="sm" />
                </div>
            </Modal.Header>

            <Modal.Body className="pt-0">
                <Row>
                    {/* Image Section */}
                    <Col md={6} className="mb-4">
                        {product.images && product.images.length > 0 ? (
                            <>
                                <div 
                                    style={{ 
                                        height: '300px', 
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}
                                    className="mb-3"
                                >
                                    <img 
                                        src={product.images[activeImageIndex]?.url} 
                                        alt={product.name}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover'
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
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    border: activeImageIndex === index ? '2px solid #0d6efd' : '2px solid transparent'
                                                }}
                                                onClick={() => setActiveImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div 
                                style={{ 
                                    height: '300px', 
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px'
                                }}
                                className="d-flex align-items-center justify-content-center"
                            >
                                <span className="text-muted fs-1">📷</span>
                            </div>
                        )}
                    </Col>

                    {/* Product Info Section */}
                    <Col md={6}>
                        <div className="mb-3">
                            <h4 className="mb-2">{product.name}</h4>
                            <h3 className="text-primary mb-3">${product.price?.toLocaleString()}</h3>
                        </div>

                        {/* Category and Region */}
                        <div className="mb-3">
                            <Badge bg="primary" className="me-2 mb-2">
                                {product.category}
                            </Badge>
                            <Badge bg="secondary" className="me-2 mb-2">
                                {product.region}
                            </Badge>
                        </div>

                        {/* Location */}
                        <div className="mb-3">
                            <strong>📍 Location:</strong>
                            <div className="text-muted">
                                {product.city}, {product.state}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <strong>Description:</strong>
                            <p className="mt-2 text-muted">
                                {product.description}
                            </p>
                        </div>

                        {/* Posted Date */}
                        <div className="mb-3">
                            <strong>Posted:</strong>
                            <div className="text-muted">
                                {formatDate(product.createdAt)}
                            </div>
                        </div>


                {/* Primary buy button */}
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleBuyNow}
                  disabled={!isAvailableForPurchase}
                  className="d-flex align-items-center justify-content-center"
                >
                  <ShoppingBag size={16} className="me-2" />
                  {!product.isActive ? "Sold Out" : "Buy Now"}
                </Button>
                
                        {/* Contact Section */}
                        <div className="mb-3">
                            <strong>Contact:</strong>
                            <div className="text-muted">
                                {product.contactEmail}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
 {/* Buy Now Modal */}
 <BuyNowModal
        show={showBuyModal}
        onHide={() => setShowBuyModal(false)}
        product={product}
        onOrderComplete={handleOrderComplete}
      />


            <Modal.Footer className="border-0 pt-0">
                <div className="d-flex gap-2 w-100">
                    <Button 
                        variant="secondary" 
                        onClick={onHide}
                        className="flex-shrink-0"
                    >
                        Close
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleContactSeller}
                        className="flex-grow-1"
                        disabled={!product.isActive}
                    >
                        {product.isActive ? '📧 Contact Seller' : 'Item Sold'}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailsModal;