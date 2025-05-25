import React, { useState } from 'react'
import { Modal, Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import CloudinaryUploadWidget from '../components/CloudinaryUploadWidget'

export function NewListing({ show, onHide, onListingAdded }) {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        state: '',
        city: '',
        region: '',
        images: []
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [uploadedImages, setUploadedImages] = useState([])

    const categories = [
        'Electronics', 'Home Appliances', 'cars/trucks', 'Motorcycles', 'Bicycles',
        'Real Estate', 'Fashion', 'Toys', 'Sports', 'health & Beauty', 'animals',
        'Furniture', 'Clothing', 'Books', 'Services', 'Misc'
    ]

    const states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
        'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ]

    const regions = ['North', 'South', 'East', 'West', 'Central']

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUploadSuccess = (imageInfo) => {
        const newImage = {
            url: imageInfo.secure_url,
            public_id: imageInfo.public_id
        }
        
        setUploadedImages(prev => {
            const updated = [...prev, newImage]
            // Update form data as well
            setFormData(prevForm => ({
                ...prevForm,
                images: updated
            }))
            return updated
        })
        
        console.log('Image uploaded successfully:', newImage)
    }

    // Handle Cloudinary upload error
    const handleImageUploadError = (error) => {
        console.error('Image upload error:', error)
        setError('Failed to upload image. Please try again.')
    }

    // Remove an uploaded image
    const removeImage = (indexToRemove) => {
        setUploadedImages(prev => {
            const updated = prev.filter((_, index) => index !== indexToRemove)
            // Update form data as well
            setFormData(prevForm => ({
                ...prevForm,
                images: updated
            }))
            return updated
        })
    }

    const validateForm = () => {
        const requiredFields = ['name', 'description', 'price', 'category', 'state', 'city', 'region']
        const emptyFields = requiredFields.filter(field => !formData[field]?.trim())
        
        if (emptyFields.length > 0) {
            setError(`Please fill in all required fields: ${emptyFields.join(', ')}`)
            return false
        }

        if (parseFloat(formData.price) <= 0) {
            setError('Price must be greater than 0')
            return false
        }

        if (formData.name.length > 50) {
            setError('Product name must be 50 characters or less')
            return false
        }

        if (formData.description.length > 500) {
            setError('Description must be 500 characters or less')
            return false
        }

        if (uploadedImages.length > 5) {
            setError('Maximum 5 images allowed')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        if (!user?.token && !localStorage.getItem('token') && !localStorage.getItem('authToken')) {
            setError('You must be logged in to create a listing')
            return
        }

        setIsLoading(true)

        try {
            // Match your exact schema requirements
            const listingData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                state: formData.state,
                city: formData.city,
                region: formData.region,
                images: uploadedImages, // Use the uploaded images from Cloudinary
                contactEmail: user.email,
                user: user._id,
                isActive: true
            }

            console.log('Creating listing with uploaded images:', listingData)

            // Get token from any available source
            const token = user?.token || localStorage.getItem('token') || localStorage.getItem('authToken')

            const response = await fetch('http://localhost:5000/products', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(listingData)
            })

            if (response.ok) {
                const newListing = await response.json()
                console.log('✅ Listing created successfully:', newListing)
                
                resetForm()
                if (onListingAdded) onListingAdded(newListing)
                onHide()
                
            } else {
                const errorData = await response.json()
                console.log('❌ API Error:', errorData)
                
                if (response.status === 400) {
                    setError(errorData.message || 'Please check all required fields')
                } else if (response.status === 401) {
                    setError('Your session has expired. Please log in again.')
                } else if (response.status === 403) {
                    setError('You do not have permission to create listings')
                } else {
                    setError(errorData.message || `Server error (${response.status})`)
                }
            }
            
        } catch (err) {
            console.error('❌ Error:', err)
            setError(err.message || 'Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            state: '',
            city: '',
            region: '',
            images: []
        })
        setUploadedImages([])
        setError('')
    }

    const handleHide = () => {
        resetForm()
        onHide()
    }

    const nameCharCount = formData.name.length
    const descriptionCharCount = formData.description.length

    return (
        <Modal show={show} onHide={handleHide} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add New Listing</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Product Name * 
                                    <span className="text-muted ms-2">
                                        ({nameCharCount}/50)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="What are you selling?"
                                    required
                                    disabled={isLoading}
                                    maxLength={50}
                                    className={nameCharCount > 50 ? 'is-invalid' : ''}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

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
                                    min="0.01"
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
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

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
                                    {states.map(state => (
                                        <option key={state} value={state}>{state}</option>
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
                                    {regions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Description *
                            <span className="text-muted ms-2">
                                ({descriptionCharCount}/500)
                            </span>
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
                            maxLength={500}
                            className={descriptionCharCount > 500 ? 'is-invalid' : ''}
                        />
                    </Form.Group>

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
                                disabled={isLoading || uploadedImages.length >= 5}
                            />
                            <Form.Text className="text-muted">
                                Upload up to 5 images ({uploadedImages.length}/5)
                            </Form.Text>
                        </div>

                        {uploadedImages.length > 0 && (
                            <div className="uploaded-images">
                                <Row>
                                    {uploadedImages.map((image, index) => (
                                        <Col key={index} md={3} className="mb-3">
                                            <Card className="h-100">
                                                <Card.Img
                                                    variant="top"
                                                    src={image.url}
                                                    style={{
                                                        height: '120px',
                                                        objectFit: 'cover'
                                                    }}
                                                    alt={`Upload ${index + 1}`}
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
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleHide} disabled={isLoading}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={isLoading || nameCharCount > 50 || descriptionCharCount > 500}
                >
                    {isLoading ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Creating...
                        </>
                    ) : (
                        'Create Listing'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewListing