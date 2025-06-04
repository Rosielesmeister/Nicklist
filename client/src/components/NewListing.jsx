import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import { useAuth } from "../hooks/UseAuth";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";
// Import our centralized API instead of duplicating code
import { productsAPI } from "../api/api"; // Adjust path based on your folder structure
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


// =============================================================================
// CONSTANTS AND DATA
// =============================================================================

const CATEGORIES = [
  "Electronics", "Home Appliances", "Cars/Trucks", "Motorcycles", "Bicycles",
  "Real Estate", "Fashion", "Toys", "Sports", "Health & Beauty", "Animals",
  "Furniture", "Clothing", "Books", "Services", "Miscellaneous",
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const REGIONS = ["North", "South", "East", "West", "Central"];

// Validation rules - easy to modify in one place
const VALIDATION_RULES = {
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  MAX_IMAGES: 5,
  MIN_PRICE: 0.01,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const NewListing = ({ show, onHide, onListingAdded }) => {
  const { user } = useAuth();
  
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  // Get initial form data
  const getInitialFormData = () => ({
    name: "",
    description: "",
    price: "",
    category: "",
    state: "",
    city: "",
    region: "",
    images: [],
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  // =============================================================================
  // INPUT HANDLERS
  // =============================================================================

  // Handle regular form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Handle successful image upload
  const handleImageUploadSuccess = (imageInfo) => {
    console.log("Full Cloudinary response:", imageInfo);
    
    const newImage = {
      url: imageInfo.secure_url || imageInfo.url,
      public_id: imageInfo.public_id,
    };

    // Validate the image URL
    if (!newImage.url) {
      console.error("No URL found in image response:", imageInfo);
      setError("Failed to get image URL from upload");
      return;
    }

    setUploadedImages(prev => {
      const updated = [...prev, newImage];
      
      // Also update form data
      setFormData(prevForm => ({
        ...prevForm,
        images: updated,
      }));
      
      return updated;
    });

    console.log("Image uploaded successfully:", newImage);
    setError(""); // Clear any upload errors
  };

  // Handle image upload errors
  const handleImageUploadError = (error) => {
    console.error("Image upload error:", error);
    setError("Failed to upload image. Please try again.");
  };

  // Remove an uploaded image
  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      
      // Also update form data
      setFormData(prevForm => ({
        ...prevForm,
        images: updated,
      }));
      
      return updated;
    });
  };

  // Validate image URL helper function
  const validateImageUrl = (url) => {
    // Check if it's a valid Cloudinary URL
    if (url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'))) {
      return url;
    }
    // If it's not a full URL, construct it
    if (url && !url.startsWith('http')) {
      return `https://res.cloudinary.com/doaoflgje/image/upload/${url}`;
    }
    return url;
  };

  // =============================================================================
  // VALIDATION
  // =============================================================================

  const validateForm = () => {
    const errors = [];

    // Required field validation
    const requiredFields = {
      name: "Product name",
      description: "Description",
      price: "Price",
      category: "Category",
      state: "State",
      city: "City",
      region: "Region"
    };

    Object.keys(requiredFields).forEach(field => {
      if (!formData[field]?.trim()) {
        errors.push(requiredFields[field]);
      }
    });

    if (errors.length > 0) {
      setError(`Please fill in the following required fields: ${errors.join(", ")}`);
      return false;
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < VALIDATION_RULES.MIN_PRICE) {
      setError(`Price must be at least $${VALIDATION_RULES.MIN_PRICE}`);
      return false;
    }

    // Length validation
    if (formData.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      setError(`Product name must be ${VALIDATION_RULES.NAME_MAX_LENGTH} characters or less`);
      return false;
    }

    if (formData.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
      setError(`Description must be ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters or less`);
      return false;
    }

    // Image validation
    if (uploadedImages.length > VALIDATION_RULES.MAX_IMAGES) {
      setError(`Maximum ${VALIDATION_RULES.MAX_IMAGES} images allowed`);
      return false;
    }

    return true;
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Check authentication
    if (!user?.token && !localStorage.getItem("token") && !localStorage.getItem("authToken")) {
      setError("You must be logged in to create a listing");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare listing data
      const listingData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        state: formData.state,
        city: formData.city.trim(),
        region: formData.region,
        images: uploadedImages,
        contactEmail: user?.email,
        user: user?._id,
        isActive: true,
      };

      console.log("Creating listing with data:", listingData);

      // Use centralized API instead of duplicate fetch code
      const newListing = await productsAPI.createProduct(listingData);
      
      console.log("✅ Listing created successfully:", newListing);

      // Reset form and notify parent
      resetForm();
      if (onListingAdded) {
        onListingAdded(newListing);
      }
      handleClose();
      
    } catch (err) {
      console.error("❌ Error creating listing:", err);
      
      // Handle different types of errors
      if (err.message.includes("401")) {
        setError("Your session has expired. Please log in again.");
      } else if (err.message.includes("403")) {
        setError("You do not have permission to create listings.");
      } else if (err.message.includes("400")) {
        setError("Please check all required fields and try again.");
      } else {
        setError(err.message || "Failed to create listing. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // MODAL MANAGEMENT
  // =============================================================================

  // Reset form to initial state
  const resetForm = () => {
    setFormData(getInitialFormData());
    setUploadedImages([]);
    setError("");
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onHide();
  };

  // =============================================================================
  // UI HELPER FUNCTIONS
  // =============================================================================

  // Get character counts for validation feedback
  const getCharacterCounts = () => ({
    name: formData.name.length,
    description: formData.description.length,
  });

  // Check if form has validation errors
  const hasValidationErrors = () => {
    const counts = getCharacterCounts();
    return (
      counts.name > VALIDATION_RULES.NAME_MAX_LENGTH ||
      counts.description > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH
    );
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Character counter component
  const CharacterCounter = ({ current, max }) => {
    const isOverLimit = current > max;
    return (
      <span className={`text-muted ms-2 ${isOverLimit ? 'text-danger' : ''}`}>
        ({current}/{max})
      </span>
    );
  };

  // Image gallery component
  const ImageGallery = () => {
    if (uploadedImages.length === 0) return null;

    return (
      <div className="uploaded-images mt-3">
        <Row>
          {uploadedImages.map((image, index) => (
            <Col key={index} md={3} className="mb-3">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={validateImageUrl(image.url)}
                  style={{
                    height: "120px",
                    objectFit: "cover",
                  }}
                  alt={`Upload ${index + 1}`}
                  onError={(e) => {
                    console.error("Image failed to load:", image.url);
                    e.target.style.display = 'none';
                  }}
                />
                <Card.Body className="p-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeImage(index)}
                    disabled={isLoading}
                    className="w-100"
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  const characterCounts = getCharacterCounts();

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add New Listing</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Product Name */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Product Name *
                  <CharacterCounter 
                    current={characterCounts.name} 
                    max={VALIDATION_RULES.NAME_MAX_LENGTH}
                  />
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="What are you selling?"
                  required
                  disabled={isLoading}
                  maxLength={VALIDATION_RULES.NAME_MAX_LENGTH + 10} // Allow typing a bit over for better UX
                  className={characterCounts.name > VALIDATION_RULES.NAME_MAX_LENGTH ? "is-invalid" : ""}
                />
                {characterCounts.name > VALIDATION_RULES.NAME_MAX_LENGTH && (
                  <Form.Control.Feedback type="invalid">
                    Product name is too long ({characterCounts.name}/{VALIDATION_RULES.NAME_MAX_LENGTH})
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Price and Category */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price * ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min={VALIDATION_RULES.MIN_PRICE}
                  step="0.01"
                  required
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* State and City */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>State *</Form.Label>
                <Form.Select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a state</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>City *</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                  required
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Region */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Region *</Form.Label>
                <Form.Select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a region</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>
              Description *
              <CharacterCounter 
                current={characterCounts.description} 
                max={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH}
              />
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your item in detail..."
              required
              disabled={isLoading}
              maxLength={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH + 50} // Allow typing a bit over
              className={characterCounts.description > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH ? "is-invalid" : ""}
            />
            {characterCounts.description > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH && (
              <Form.Control.Feedback type="invalid">
                Description is too long ({characterCounts.description}/{VALIDATION_RULES.DESCRIPTION_MAX_LENGTH})
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Images (Optional)</Form.Label>
            <div className="d-flex align-items-center gap-3 mb-3">
              <CloudinaryUploadWidget
                onUploadSuccess={handleImageUploadSuccess}
                onUploadError={handleImageUploadError}
                multiple={false}
                maxFiles={1}
                folder="marketplace/listings"
                buttonText="Add Image"
                disabled={isLoading || uploadedImages.length >= VALIDATION_RULES.MAX_IMAGES}
              />
              <Form.Text className="text-muted">
                Upload up to {VALIDATION_RULES.MAX_IMAGES} images ({uploadedImages.length}/{VALIDATION_RULES.MAX_IMAGES})
              </Form.Text>
            </div>

            <ImageGallery />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || hasValidationErrors()}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Creating Listing...
            </>
          ) : (
            "Create Listing"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewListing;