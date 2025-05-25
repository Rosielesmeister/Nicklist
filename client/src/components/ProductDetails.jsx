import React, { useState } from 'react'
import { Modal, Button, Row, Col, Badge, Carousel, Alert } from 'react-bootstrap'

const ProductDetailsModal = ({ show, onHide, product }) => {
    const [imageIndex, setImageIndex] = useState(0)

    if (!product) return null

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleContactSeller = () => {
        // Create mailto link or show contact info
        const subject = encodeURIComponent(`Interested in: ${product.name}`)
        const body = encodeURIComponent(`Hi,\n\nI'm interested in your listing "${product.name}" for ${formatPrice(product.price)}.\n\nPlease let me know if it's still available.\n\nThanks!`)
        
        window.location.href = `mailto:${product.contactEmail}?subject=${subject}&body=${body}`
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{product.name}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Row>
                    {/* Images Section */}
                    <Col md={6}>
                        {product.images && product.images.length > 0 ? (
                            <div className="product-images">
                                {product.images.length === 1 ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="img-fluid rounded"
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Carousel
                                        activeIndex={imageIndex}
                                        onSelect={(selectedIndex) => setImageIndex(selectedIndex)}
                                        indicators={product.images.length > 1}
                                        controls={product.images.length > 1}
                                    >
                                        {product.images.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={image.url}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="d-block w-100 rounded"
                                                    style={{ height: '400px', objectFit: 'cover' }}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                )}
                                
                                {/* Thumbnail navigation for multiple images */}
                                {product.images.length > 1 && (
                                    <div className="d-flex gap-2 mt-2 justify-content-center">
                                        {product.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.url}
                                                alt={`Thumbnail ${index + 1}`}
                                                className={`img-thumbnail ${index === imageIndex ? 'border-primary' : ''}`}
                                                style={{ 
                                                    width: '60px', 
                                                    height: '60px', 
                                                    objectFit: 'cover',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div 
                                className="d-flex align-items-center justify-content-center bg-light rounded"
                                style={{ height: '400px' }}
                            >
                                <div className="text-center text-muted">
                                    <i className="fas fa-image fa-3x mb-2"></i>
                                    <p>No images available</p>
                                </div>
                            </div>
                        )}
                    </Col>
                    
                    {/* Product Info Section */}
                    <Col md={6}>
                        <div className="product-info">
                            {/* Price */}
                            <div className="mb-3">
                                <h2 className="text-success mb-0">{formatPrice(product.price)}</h2>
                            </div>
                            
                            {/* Category and Status */}
                            <div className="mb-3">
                                <Badge bg="primary" className="me-2">{product.category}</Badge>
                                {product.isActive ? (
                                    <Badge bg="success">Available</Badge>
                                ) : (
                                    <Badge bg="secondary">Not Available</Badge>
                                )}
                            </div>
                            
                            {/* Description */}
                            <div className="mb-3">
                                <h5>Description</h5>
                                <p className="text-muted">{product.description}</p>
                            </div>
                            
                            {/* Details */}
                            <div className="mb-3">
                                <h5>Details</h5>
                                <Row className="g-2">
                                    <Col sm={6}>
                                        <strong>Location:</strong>
                                        <p className="mb-1">{product.city}, {product.state}</p>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Region:</strong>
                                        <p className="mb-1">{product.region}</p>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Posted:</strong>
                                        <p className="mb-1">{formatDate(product.createdAt)}</p>
                                    </Col>
                                    <Col sm={6}>
                                        <strong>Updated:</strong>
                                        <p className="mb-1">{formatDate(product.updatedAt)}</p>
                                    </Col>
                                </Row>
                            </div>
                            
                            {/* Contact Section */}
                            <div className="mb-3">
                                <h5>Seller Information</h5>
                                <p className="mb-1">
                                    <strong>Contact:</strong> {product.contactEmail}
                                </p>
                                {product.user && (
                                    <p className="mb-1">
                                        <strong>Seller ID:</strong> {product.user}
                                    </p>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="d-grid gap-2">
                                <Button 
                                    variant="success" 
                                    size="lg"
                                    onClick={handleContactSeller}
                                    disabled={!product.isActive}
                                >
                                    <i className="fas fa-envelope me-2"></i>
                                    Contact Seller
                                </Button>
                                
                                <Button 
                                    variant="outline-primary"
                                    onClick={() => {
                                        // Add to favorites functionality
                                        console.log('Add to favorites:', product._id)
                                        // You can implement this later
                                    }}
                                >
                                    <i className="fas fa-heart me-2"></i>
                                    Save to Favorites
                                </Button>
                            </div>
                            
                            {/* Safety Notice */}
                            <Alert variant="warning" className="mt-3 small">
                                <strong>Safety Tip:</strong> Meet in a public place when buying/selling items. 
                                Never send money or personal information before meeting the seller.
                            </Alert>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ProductDetailsModal