// pages/UserProfile.jsx - Updated with Edit functionality
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs, Modal } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { productsAPI, favoritesAPI } from '../api/api'
import EditListing from '../components/EditListing' // Import the new component

export default function UserProfile() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('listings')
    const [userListings, setUserListings] = useState([]) 
    const [userFavorites, setUserFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [favoritesLoading, setFavoritesLoading] = useState(false)
    
    // Edit listing states
    const [showEditListing, setShowEditListing] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null)
    
    // Delete confirmation states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [listingToDelete, setListingToDelete] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Fetch user's own products and favorites
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                // Fetch user's listings
                const listingsResponse = await productsAPI.getUserProducts();
                setUserListings(listingsResponse || []);

                // Fetch user's favorites
                try {
                    const favoritesResponse = await favoritesAPI.getUserFavorites();
                    setUserFavorites(favoritesResponse || []);
                } catch (favError) {
                    console.error('Error fetching favorites:', favError);
                    setUserFavorites([]);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserListings([]);
                setUserFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    // Handle removing from favorites
    const handleRemoveFromFavorites = async (productId) => {
        setFavoritesLoading(true);
        try {
            await favoritesAPI.removeFromFavorites(productId);
            // Remove from local state
            setUserFavorites(prev => prev.filter(fav => 
                fav._id !== productId && fav.product?._id !== productId
            ));
        } catch (error) {
            console.error('Error removing from favorites:', error);
            alert('Failed to remove from favorites');
        } finally {
            setFavoritesLoading(false);
        }
    };

    // Handle edit listing
    const handleEditListing = (listing) => {
        setSelectedListing(listing);
        setShowEditListing(true);
    };

    // Handle listing updated
    const handleListingUpdated = (updatedListing) => {
        setUserListings(prev => 
            prev.map(listing => 
                listing._id === updatedListing._id ? updatedListing : listing
            )
        );
        setShowEditListing(false);
        setSelectedListing(null);
    };

    // Handle delete listing
    const handleDeleteListing = (listing) => {
        setListingToDelete(listing);
        setShowDeleteConfirm(true);
    };

    // Confirm delete listing
    const confirmDeleteListing = async () => {
        if (!listingToDelete) return;

        setDeleteLoading(true);
        try {
            await productsAPI.deleteProduct(listingToDelete._id);
            // Remove from local state
            setUserListings(prev => 
                prev.filter(listing => listing._id !== listingToDelete._id)
            );
            setShowDeleteConfirm(false);
            setListingToDelete(null);
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleGoHome = () => {
        navigate('/')
    }

    // Image URL validation function
    const getValidImageUrl = (image) => {
        if (!image || !image.url) return null;
        
        // If it's already a full URL, return as is
        if (image.url.startsWith('http')) {
            return image.url;
        }
        
        // If it's a Cloudinary public_id, construct the full URL
        if (image.public_id) {
            return `https://res.cloudinary.com/doaoflgje/image/upload/${image.public_id}`;
        }
        
        // Fallback
        return image.url;
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <div>Loading...</div>
            </Container>
        )
    }

    if (!user) {
        return (
            <Container className="text-center mt-5">
                <div>Please log in to view your profile.</div>
            </Container>
        )
    }

    return (
        <Container>
            {/* Profile Header */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                             style={{width: '60px', height: '60px'}}>
                                            <span className="text-white fw-bold fs-4">
                                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{user?.firstName} {user?.lastName}</h3>
                                            <p className="text-muted mb-0">{user?.email}</p>
                                            <Badge bg={user?.isAdmin ? 'warning' : 'success'} className="mt-1">
                                                {user?.isAdmin ? 'Admin' : 'Member'}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4} className="text-md-end">
                                    <Button variant="success" onClick={handleGoHome} className="me-2">
                                        Browse All Listings
                                    </Button>
                                    <Button variant="primary">
                                        + Add New Listing
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <Card className="text-center border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="text-primary mb-1">{userListings.length}</h4>
                            <small className="text-muted">My Total Listings</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="text-center border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="text-success mb-1">
                                {userListings.filter(item => item.isActive).length}
                            </h4>
                            <small className="text-muted">Active Listings</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="text-center border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="text-warning mb-1">{userFavorites.length}</h4>
                            <small className="text-muted">Saved Favorites</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* My Listings and Favorites Tabs */}
            <Row>
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-3"
                            >
                                <Tab eventKey="listings" title={`My Listings (${userListings.length})`}>
                                    <Row>
                                        {userListings.map((listing) => (
                                            <Col md={6} lg={4} key={listing._id} className="mb-3">
                                                <Card className="h-100 border-0 shadow-sm">
                                                    <div style={{height: '200px', backgroundColor: '#f8f9fa'}} 
                                                         className="d-flex align-items-center justify-content-center">
                                                        {listing.images && listing.images.length > 0 ? (
                                                            <img 
                                                                src={getValidImageUrl(listing.images[0])} 
                                                                alt={listing.name}
                                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                                onError={(e) => {
                                                                    console.error('Image failed to load:', listing.images[0]);
                                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-muted">📷 No Image</span>
                                                        )}
                                                    </div>
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <h6 className="mb-0">{listing.name}</h6>
                                                            <Badge bg={listing.isActive ? 'success' : 'secondary'}>
                                                                {listing.isActive ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-muted small mb-2">
                                                            {listing.description?.length > 100 
                                                                ? `${listing.description.substring(0, 100)}...` 
                                                                : listing.description}
                                                        </p>
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <strong className="text-primary">
                                                                ${listing.price}
                                                            </strong>
                                                            <small className="text-muted">
                                                                📍 {listing.city}, {listing.state}
                                                            </small>
                                                        </div>
                                                        <div className="mt-2">
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                className="me-2"
                                                                onClick={() => handleEditListing(listing)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm"
                                                                onClick={() => handleDeleteListing(listing)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    {userListings.length === 0 && (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No listings yet</h5>
                                            <p className="text-muted">Start selling by creating your first listing!</p>
                                            <Button variant="primary">
                                                + Add Your First Listing
                                            </Button>
                                        </div>
                                    )}
                                </Tab>
                                
                                <Tab eventKey="favorites" title={`Favorites (${userFavorites.length})`}>
                                    <Row>
                                        {userFavorites.map((favorite) => {
                                            // Handle both direct product objects and nested product objects
                                            const product = favorite.product || favorite;
                                            return (
                                                <Col md={6} lg={4} key={product._id} className="mb-3">
                                                    <Card className="h-100 border-0 shadow-sm">
                                                        <div style={{height: '200px', backgroundColor: '#f8f9fa'}} 
                                                             className="d-flex align-items-center justify-content-center">
                                                            {product.images && product.images.length > 0 ? (
                                                                <img 
                                                                    src={getValidImageUrl(product.images[0])} 
                                                                    alt={product.name}
                                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                                    onError={(e) => {
                                                                        console.error('Image failed to load:', product.images[0]);
                                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-muted">📷 No Image</span>
                                                            )}
                                                        </div>
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="mb-0">{product.name}</h6>
                                                                <Badge bg={product.isActive ? 'success' : 'secondary'}>
                                                                    {product.isActive ? 'Available' : 'Sold'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-muted small mb-2">
                                                                {product.description?.length > 100 
                                                                    ? `${product.description.substring(0, 100)}...` 
                                                                    : product.description}
                                                            </p>
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <strong className="text-success">
                                                                    ${product.price}
                                                                </strong>
                                                                <small className="text-muted">
                                                                    📍 {product.city}, {product.state}
                                                                </small>
                                                            </div>
                                                            <div className="mt-2 d-flex gap-2">
                                                                <Button 
                                                                    variant="primary" 
                                                                    size="sm" 
                                                                    className="flex-grow-1"
                                                                    onClick={handleGoHome}
                                                                >
                                                                    View Details
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm"
                                                                    disabled={favoritesLoading}
                                                                    onClick={() => handleRemoveFromFavorites(product._id)}
                                                                >
                                                                    💔
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                    {userFavorites.length === 0 && (
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No favorites yet</h5>
                                            <p className="text-muted">Browse listings and save your favorites!</p>
                                            <Button variant="outline-primary" onClick={handleGoHome}>
                                                Browse All Listings
                                            </Button>
                                        </div>
                                    )}
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Edit Listing Modal */}
            {selectedListing && (
                <EditListing
                    show={showEditListing}
                    onHide={() => {
                        setShowEditListing(false);
                        setSelectedListing(null);
                    }}
                    listing={selectedListing}
                    onListingUpdated={handleListingUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete "<strong>{listingToDelete?.name}</strong>"?</p>
                    <p className="text-muted">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={confirmDeleteListing}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Listing'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}