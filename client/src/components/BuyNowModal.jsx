import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Spinner
} from 'react-bootstrap';
import {
  CreditCard,
  MapPin,
  Lock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';
// Import your centralized API instead of undefined ordersAPI
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


const BuyNowModal = ({ show, onHide, product, onOrderComplete }) => {
  const { user } = useAuth();
  
  // =============================================================================
  // FORM STATE MANAGEMENT
  // =============================================================================
  
  // Initial form data with better organization
  const getInitialFormData = () => ({
    // Contact Information
    fullName: user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : (user?.name || ''),
    email: user?.email || '',
    phone: '',
    
    // Shipping Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Order notes
    orderNotes: ''
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // =============================================================================
  // PRICE CALCULATIONS
  // =============================================================================
  
  const calculatePricing = () => {
    const productPrice = product?.price || 0;
    const tax = productPrice * 0.08; // 8% tax
    const shipping = productPrice > 50 ? 0 : 9.99; // Free shipping over $50
    const total = productPrice + tax + shipping;
    
    return { productPrice, tax, shipping, total };
  };

  const pricing = calculatePricing();

  // =============================================================================
  // INPUT HANDLERS
  // =============================================================================

  // Handle regular form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Format card number with spaces (1234 5678 9012 3456)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add spaces every 4 digits
    
    if (value.length <= 19) { // Max length with spaces
      setFormData(prev => ({
        ...prev,
        cardNumber: value
      }));
      
      // Clear card number error
      if (errors.cardNumber) {
        setErrors(prev => ({
          ...prev,
          cardNumber: ''
        }));
      }
    }
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
    
    // Clear expiry error
    if (errors.expiryDate) {
      setErrors(prev => ({
        ...prev,
        expiryDate: ''
      }));
    }
  };

  // Handle CVV input (only numbers, max 4 digits)
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setFormData(prev => ({
      ...prev,
      cvv: value
    }));
    
    // Clear CVV error
    if (errors.cvv) {
      setErrors(prev => ({
        ...prev,
        cvv: ''
      }));
    }
  };

  // =============================================================================
  // VALIDATION
  // =============================================================================

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = {
      fullName: 'Full name is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      address: 'Address is required',
      city: 'City is required',
      state: 'State is required',
      zipCode: 'ZIP code is required',
      cardName: 'Cardholder name is required',
      expiryDate: 'Expiry date is required',
      cvv: 'CVV is required'
    };

    // Check all required fields
    Object.keys(requiredFields).forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = requiredFields[field];
      }
    });

    // Card number validation (special case because of spaces)
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // CVV validation
    if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    // ZIP code validation (basic US format)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (12345 or 12345-6789)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =============================================================================
  // ORDER SUBMISSION
  // =============================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Check if product exists
    if (!product) {
      setErrors({ general: 'Product information is missing' });
      return;
    }

    setProcessing(true);
    setErrors({}); // Clear any previous errors

    try {
      // Prepare order data
      const orderData = {
        product: product._id,
        seller: product.user?._id || product.user,
        quantity: 1,
        price: product.price,
        
        shippingAddress: {
          fullName: formData.fullName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: 'United States'
        },
        
        contactInfo: {
          email: formData.email.trim(),
          phone: formData.phone.trim()
        },
        
        paymentInfo: {
          cardLast4: formData.cardNumber.replace(/\s/g, '').slice(-4),
          cardType: 'Card',
          cardName: formData.cardName.trim()
        },
        
        pricing: pricing,
        
        orderNotes: formData.orderNotes.trim()
      };

      console.log('Submitting order:', orderData);

      // Create the order using our centralized API
      const order = await ordersAPI.createOrder(orderData);
      
      console.log('Order created successfully:', order);

      // Simulate payment processing delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Set success state
      setCompletedOrder(order);
      setOrderSuccess(true);

      // Notify parent component
      if (onOrderComplete) {
        onOrderComplete(order);
      }

    } catch (error) {
      console.error('Error creating order:', error);
      
      // Show user-friendly error message
      setErrors({ 
        general: `Failed to process order: ${error.message || 'Please try again.'}` 
      });
    } finally {
      setProcessing(false);
    }
  };

  // =============================================================================
  // MODAL MANAGEMENT
  // =============================================================================

  // Reset modal state when closing
  const handleClose = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setProcessing(false);
    setOrderSuccess(false);
    setCompletedOrder(null);
    onHide();
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Success screen component
  const SuccessScreen = () => (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Body className="text-center py-5">
        <CheckCircle size={64} className="text-success mb-3" />
        <h3 className="text-success mb-3">Order Placed Successfully!</h3>
        <p className="mb-4">
          Thank you for your purchase! Your order has been confirmed and the seller has been notified.
        </p>
        
        <Card className="mb-4">
          <Card.Body>
            <h6>Order Details</h6>
            <div className="text-start">
              <div className="d-flex justify-content-between">
                <span>Order ID:</span>
                <span>#{completedOrder._id || completedOrder.id}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Item:</span>
                <span>{product.name}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Paid:</span>
                <span className="fw-bold">${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <p className="text-muted small mb-4">
          You will receive an email confirmation shortly. The seller will contact you soon to arrange delivery or pickup.
        </p>
        
        <Button variant="primary" onClick={handleClose}>
          Continue Shopping
        </Button>
      </Modal.Body>
    </Modal>
  );

  // Product summary component
  const ProductSummary = () => (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="me-3">
            {product?.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                className="rounded"
              />
            ) : (
              <div 
                className="bg-light rounded d-flex align-items-center justify-content-center"
                style={{ width: '80px', height: '80px' }}
              >
                <span className="text-muted">No Image</span>
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1">{product?.name}</h5>
            <p className="text-muted mb-1">{product?.description}</p>
            <span className="h4 text-primary mb-0">${product?.price?.toFixed(2)}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // Order summary component
  const OrderSummary = () => (
    <Card className="bg-light">
      <Card.Header>
        <h6 className="mb-0">Order Summary</h6>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <span>Item Price:</span>
          <span>${pricing.productPrice.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Tax (8%):</span>
          <span>${pricing.tax.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Shipping:</span>
          <span>{pricing.shipping === 0 ? 'FREE' : `$${pricing.shipping.toFixed(2)}`}</span>
        </div>
        {pricing.shipping === 0 && (
          <small className="text-success d-block mb-2">
            🎉 Free shipping on orders over $50!
          </small>
        )}
        <hr />
        <div className="d-flex justify-content-between h6">
          <span>Total:</span>
          <span className="text-primary">${pricing.total.toFixed(2)}</span>
        </div>
      </Card.Body>
    </Card>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  // Show success screen if order completed
  if (orderSuccess && completedOrder) {
    return <SuccessScreen />;
  }

  // Main modal form
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Buy Now - {product?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* General Error Alert */}
        {errors.general && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errors.general}
          </Alert>
        )}

        {/* Product Summary */}
        <ProductSummary />

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              {/* Contact & Shipping Section */}
              <div className="mb-4">
                <h6 className="d-flex align-items-center mb-3">
                  <MapPin className="me-2" size={18} />
                  Contact & Shipping Information
                </h6>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.fullName}
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                        placeholder="(555) 123-4567"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        isInvalid={!!errors.address}
                        placeholder="123 Main Street"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        isInvalid={!!errors.city}
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        isInvalid={!!errors.state}
                        placeholder="CA"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        isInvalid={!!errors.zipCode}
                        placeholder="12345"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.zipCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Payment Section */}
              <div className="mb-4">
                <h6 className="d-flex align-items-center mb-3">
                  <CreditCard className="me-2" size={18} />
                  Payment Information
                </h6>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        isInvalid={!!errors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cardholder Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.cardName}
                        placeholder="John Doe"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date *</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        isInvalid={!!errors.expiryDate}
                        placeholder="MM/YY"
                        maxLength="5"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.expiryDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleCvvChange}
                        isInvalid={!!errors.cvv}
                        placeholder="123"
                        maxLength="4"
                        size="sm"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cvv}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Order Notes */}
              <Form.Group className="mb-3">
                <Form.Label>Order Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for the seller..."
                  size="sm"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              {/* Order Summary */}
              <OrderSummary />
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={processing}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit}
          disabled={processing}
          className="d-flex align-items-center"
        >
          {processing ? (
            <>
              <Spinner size="sm" className="me-2" />
              Processing Order...
            </>
          ) : (
            <>
              <Lock className="me-2" size={16} />
              Complete Purchase - ${pricing.total.toFixed(2)}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyNowModal;