// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { productsAPI } from '../api/api';
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import NewListing from '../components/NewListing';

const Home = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [showNewListing, setShowNewListing] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    const categories = [
        "Electronics", "Home Appliances", "cars/trucks", "Motorcycles", "Bicycles",
        "Real Estate", "Fashion", "Toys", "Sports", "health & Beauty", "animals",
        "Furniture", "Clothing", "Books", "Services", "Misc"
    ];

    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
        "New Hampshire", "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
        "West Virginia", "Wisconsin", "Wyoming"
    ];

    const regions = ["North", "South", "East", "West", "Central"];

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await productsAPI.getAllProducts();
            setProducts(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle product detail view
    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowProductDetails(true);
    };

    // Handle new listing added
    const handleListingAdded = (newListing) => {
        setProducts(prev => [newListing.product || newListing, ...prev]);
        setShowNewListing(false);
    };

    // Filter products based on search criteria
    const filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesState = !selectedState || product.state === selectedState;
        const matchesRegion = !selectedRegion || product.region === selectedRegion;
        
        const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                            (!priceRange.max || product.price <= parseFloat(priceRange.max));

        return matchesSearch && matchesCategory && matchesState && matchesRegion && matchesPrice;
    });

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedState('');
        setSelectedRegion('');
        setPriceRange({ min: '', max: '' });
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <div className="mt-3">Loading products...</div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h2 className="mb-0">Nicklist Marketplace</h2>
                            <p className="text-muted mb-0">Find great deals in your area</p>
                        </div>
                        {user && (
                            <Button 
                                variant="primary" 
                                onClick={() => setShowNewListing(true)}
                                className="d-flex align-items-center gap-2"
                            >
                                <span>+</span> Add Listing
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {error && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant="danger" dismissible onClose={() => setError('')}>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row>
                {/* Filters Sidebar */}
                <Col lg={3} className="mb-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Filters</h5>
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    Clear All
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Search */}
                            <Form.Group className="mb-3">
                                <Form.Label>Search</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>

                            {/* Category Filter */}
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Price Range */}
                            <Form.Group className="mb-3">
                                <Form.Label>Price Range</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            {/* State Filter */}
                            <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                >
                                    <option value="">All States</option>
                                    {states.map(state => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Region Filter */}
                            <Form.Group className="mb-3">
                                <Form.Label>Region</Form.Label>
                                <Form.Select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    <option value="">All Regions</option>
                                    {regions.map(region => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Products Grid */}
                <Col lg={9}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">
                            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                        </h5>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center py-5">
                                <div className="text-muted mb-3" style={{ fontSize: '4rem' }}>🔍</div>
                                <h5 className="text-muted">No products found</h5>
                                <p className="text-muted">
                                    {products.length === 0 
                                        ? 'No products have been listed yet.' 
                                        : 'Try adjusting your search criteria.'}
                                </p>
                                {user && products.length === 0 && (
                                    <Button 
                                        variant="primary" 
                                        onClick={() => setShowNewListing(true)}
                                    >
                                        Be the first to list something!
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    ) : (
                        <Row>
                            {filteredProducts.map(product => (
                                <Col key={product._id} sm={6} lg={4} xl={3} className="mb-4">
                                    <ProductCard 
                                        product={product}
                                        onViewDetails={handleViewDetails}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>

            {/* Product Details Modal */}
            <ProductDetailsModal
                show={showProductDetails}
                onHide={() => setShowProductDetails(false)}
                product={selectedProduct}
            />

            {/* New Listing Modal */}
            {user && (
                <NewListing
                    show={showNewListing}
                    onHide={() => setShowNewListing(false)}
                    onListingAdded={handleListingAdded}
                />
            )}
        </Container>
    );
};

export default Home;