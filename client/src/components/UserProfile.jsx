import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs, Alert, Spinner } from "react-bootstrap";
import { User, Plus, Home, Heart, Package, Activity } from "lucide-react";
import { useAuth } from "../hooks/UseAuth";
import { useNavigate } from "react-router-dom";
// Import our centralized API instead of wrong path
import { productsAPI, favoritesAPI } from "../api/api"; // Adjust path based on your folder structure
// Import components from correct location
import EditListing from "../components/EditListing";
import NewListing from "../components/NewListing";
import ProductCard from "../components/ProductCard"; // Fixed: should be from components, not pages
import ProductDetailsModal from "../components/ProductDetailsModal"; // Fixed: should be from components, not pages
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";


// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const UI_CONFIG = {
  AVATAR_SIZE: "60px",
  LISTING_IMAGE_HEIGHT: "200px",
  MAX_DESCRIPTION_LENGTH: 100,
  TABS: {
    LISTINGS: "listings",
    FAVORITES: "favorites",
  },
};

const CARD_STYLES = {
  profile: "border-0 shadow-sm",
  stat: "text-center border-0 shadow-sm", 
  main: "border-0 shadow-sm",
  listing: "h-100 border-0 shadow-sm",
};

const MESSAGES = {
  loading: "Loading your profile...",
  loginRequired: "Please log in to view your profile.",
  noListings: "No listings yet",
  noListingsSubtext: "Start selling by creating your first listing!",
  noFavorites: "No favorites yet",
  noFavoritesSubtext: "Browse listings and save your favorites!",
  deleteConfirm: "Are you sure you want to delete this listing? This action cannot be undone.",
  deleteSuccess: "Listing deleted successfully!",
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Format user initials for avatar
const getUserInitials = (user) => {
  if (!user) return "?";
  const first = user.firstName?.[0] || "";
  const last = user.lastName?.[0] || "";
  return (first + last) || user.email?.[0] || "U";
};

// Get user display name
const getUserDisplayName = (user) => {
  if (!user) return "Unknown User";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.name || user.email || "User";
};

// Truncate description text
const truncateDescription = (description, maxLength = UI_CONFIG.MAX_DESCRIPTION_LENGTH) => {
  if (!description) return "No description available";
  if (description.length <= maxLength) return description;
  return `${description.substring(0, maxLength)}...`;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  const [activeTab, setActiveTab] = useState(UI_CONFIG.TABS.LISTINGS);
  const [userListings, setUserListings] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showEditListing, setShowEditListing] = useState(false);
  const [showNewListing, setShowNewListing] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Loading states for specific actions
  const [deletingListing, setDeletingListing] = useState(null);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  // User statistics
  const userStats = {
    totalListings: userListings.length,
    activeListings: userListings.filter(item => item.isActive).length,
    totalFavorites: userFavorites.length,
  };

  // User display information
  const userInfo = {
    initials: getUserInitials(user),
    displayName: getUserDisplayName(user),
    email: user?.email || "No email",
    isAdmin: user?.isAdmin || false,
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch user data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // =============================================================================
  // DATA FETCHING
  // =============================================================================

  // Fetch user's listings and favorites
  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      console.log("Fetching user data for user:", user);

      // Fetch user's listings
      const listingsResponse = await productsAPI.getUserProducts();
      console.log("User listings response:", listingsResponse);
      setUserListings(listingsResponse || []);

      // Fetch user's favorites
      try {
        const favoritesResponse = await favoritesAPI.getUserFavorites();
        console.log("User favorites response:", favoritesResponse);
        setUserFavorites(favoritesResponse || []);
      } catch (favError) {
        console.error("Error fetching favorites:", favError);
        setUserFavorites([]);
        // Don't show error for favorites failure, just log it
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load your profile data. Please try refreshing the page.");
      setUserListings([]);
      setUserFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  // Handle product detail view
  const handleViewDetails = (listing) => {
    console.log("Viewing details for listing:", listing);
    setSelectedListing(listing);
    setShowProductDetails(true);
  };

  // Handle edit listing
  const handleEditListing = (listing) => {
    setSelectedListing(listing);
    setShowEditListing(true);
  };

  // Handle delete listing with better UX
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(MESSAGES.deleteConfirm)) {
      return;
    }

    setDeletingListing(listingId);

    try {
      console.log("Attempting to delete listing:", listingId);

      await productsAPI.deleteProduct(listingId);
      
      // Remove from local state only after successful deletion
      setUserListings(prev => prev.filter(listing => listing._id !== listingId));
      
      // Show success message (could be replaced with toast notification)
      alert(MESSAGES.deleteSuccess);
      
    } catch (error) {
      console.error("Error deleting listing:", error);
      
      // Show specific error message
      let errorMessage = "Failed to delete listing. ";
      
      if (error.message.includes("403")) {
        errorMessage += "You do not have permission to delete this listing.";
      } else if (error.message.includes("404")) {
        errorMessage += "Listing not found.";
      } else if (error.message.includes("401")) {
        errorMessage += "Please log in again.";
      } else {
        errorMessage += error.message || "Please try again.";
      }
      
      alert(errorMessage);
    } finally {
      setDeletingListing(null);
    }
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

  // Handle new listing added
  const handleListingAdded = (newListing) => {
    const listingToAdd = newListing.product || newListing;
    setUserListings(prev => [listingToAdd, ...prev]);
    setShowNewListing(false);
  };

  // Navigation handlers
  const handleGoHome = () => {
    navigate("/");
  };

  // Modal close handlers
  const handleCloseModals = () => {
    setShowEditListing(false);
    setShowNewListing(false);
    setShowProductDetails(false);
    setSelectedListing(null);
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Loading state component
  const LoadingState = () => (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" className="mb-3" />
      <div>{MESSAGES.loading}</div>
    </Container>
  );

  // Error state component
  const ErrorState = () => (
    <Container className="mt-4">
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="ms-3"
          onClick={fetchUserData}
        >
          Try Again
        </Button>
      </Alert>
    </Container>
  );

  // User not logged in state
  const NotLoggedInState = () => (
    <Container className="text-center mt-5">
      <User size={48} className="text-muted mb-3" />
      <div>{MESSAGES.loginRequired}</div>
    </Container>
  );

  // Profile header component
  const ProfileHeader = () => (
    <Row className="mb-4">
      <Col>
        <Card className={CARD_STYLES.profile}>
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: UI_CONFIG.AVATAR_SIZE, height: UI_CONFIG.AVATAR_SIZE }}
                  >
                    <span className="text-white fw-bold fs-4">
                      {userInfo.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1">{userInfo.displayName}</h3>
                    <p className="text-muted mb-0">{userInfo.email}</p>
                    <Badge bg={userInfo.isAdmin ? "warning" : "success"} className="mt-1">
                      {userInfo.isAdmin ? "Admin" : "Member"}
                    </Badge>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-md-end">
                <Button 
                  variant="success" 
                  onClick={handleGoHome} 
                  className="me-2"
                >
                  <Home size={16} className="me-1" />
                  Browse All Listings
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setShowNewListing(true)}
                >
                  <Plus size={16} className="me-1" />
                  Add New Listing
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Statistics cards component
  const StatsCards = () => (
    <Row className="mb-4">
      <Col md={4} className="mb-3">
        <Card className={CARD_STYLES.stat}>
          <Card.Body>
            <Package size={24} className="text-primary mb-2" />
            <h4 className="text-primary mb-1">{userStats.totalListings}</h4>
            <small className="text-muted">My Total Listings</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-3">
        <Card className={CARD_STYLES.stat}>
          <Card.Body>
            <Activity size={24} className="text-success mb-2" />
            <h4 className="text-success mb-1">{userStats.activeListings}</h4>
            <small className="text-muted">Active Listings</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-3">
        <Card className={CARD_STYLES.stat}>
          <Card.Body>
            <Heart size={24} className="text-warning mb-2" />
            <h4 className="text-warning mb-1">{userStats.totalFavorites}</h4>
            <small className="text-muted">Saved Favorites</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // Custom listing card for user's own listings (shows edit/delete buttons)
  const UserListingCard = ({ listing }) => (
    <Col md={6} lg={4} key={listing._id} className="mb-3">
      <Card className={CARD_STYLES.listing}>
        <div
          style={{ 
            height: UI_CONFIG.LISTING_IMAGE_HEIGHT, 
            backgroundColor: "#f8f9fa",
            position: "relative",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0].url}
              alt={listing.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-muted">📷 Image Error</span>';
              }}
            />
          ) : (
            <span className="text-muted">📷 No Image</span>
          )}
          
          {/* Loading overlay for delete action */}
          {deletingListing === listing._id && (
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <Spinner animation="border" variant="light" />
            </div>
          )}
        </div>
        
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="mb-0 text-truncate" style={{ maxWidth: "70%" }}>
              {listing.name}
            </h6>
            <Badge bg={listing.isActive ? "success" : "secondary"}>
              {listing.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <p className="text-muted small mb-2">
            {truncateDescription(listing.description)}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="text-primary">${listing.price?.toLocaleString()}</strong>
            <small className="text-muted">
              📍 {listing.city}, {listing.state}
            </small>
          </div>
          
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="flex-grow-1"
              onClick={() => handleViewDetails(listing)}
            >
              View Details
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleEditListing(listing)}
              disabled={deletingListing === listing._id}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteListing(listing._id)}
              disabled={deletingListing === listing._id}
            >
              {deletingListing === listing._id ? (
                <Spinner size="sm" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  // Empty state for listings
  const EmptyListingsState = () => (
    <div className="text-center py-5">
      <Package size={48} className="text-muted mb-3" />
      <h5 className="text-muted">{MESSAGES.noListings}</h5>
      <p className="text-muted">{MESSAGES.noListingsSubtext}</p>
      <Button variant="primary" onClick={() => setShowNewListing(true)}>
        <Plus size={16} className="me-1" />
        Add Your First Listing
      </Button>
    </div>
  );

  // Empty state for favorites
  const EmptyFavoritesState = () => (
    <div className="text-center py-5">
      <Heart size={48} className="text-muted mb-3" />
      <h5 className="text-muted">{MESSAGES.noFavorites}</h5>
      <p className="text-muted">{MESSAGES.noFavoritesSubtext}</p>
      <Button variant="outline-primary" onClick={handleGoHome}>
        <Home size={16} className="me-1" />
        Browse All Listings
      </Button>
    </div>
  );

  // Main tabs content
  const TabsContent = () => (
    <Row>
      <Col>
        <Card className={CARD_STYLES.main}>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={setActiveTab}
              className="mb-3"
            >
              <Tab
                eventKey={UI_CONFIG.TABS.LISTINGS}
                title={`My Listings (${userStats.totalListings})`}
              >
                <Row>
                  {userListings.map(listing => (
                    <UserListingCard key={listing._id} listing={listing} />
                  ))}
                </Row>
                {userListings.length === 0 && <EmptyListingsState />}
              </Tab>

              <Tab
                eventKey={UI_CONFIG.TABS.FAVORITES}
                title={`Favorites (${userStats.totalFavorites})`}
              >
                <Row>
                  {userFavorites.map(favorite => {
                    const product = favorite.product || favorite;
                    return (
                      <Col key={product._id} sm={6} lg={4} xl={3} className="mb-4">
                        <ProductCard
                          product={product}
                          onViewDetails={handleViewDetails}
                        />
                      </Col>
                    );
                  })}
                </Row>
                {userFavorites.length === 0 && <EmptyFavoritesState />}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  // Handle different states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!user) return <NotLoggedInState />;

  return (
    <>
      <Container>
        <ProfileHeader />
        <StatsCards />
        <TabsContent />
      </Container>

      {/* Modals */}
      <ProductDetailsModal
        show={showProductDetails}
        onHide={() => setShowProductDetails(false)}
        product={selectedListing}
      />

      {showEditListing && selectedListing && (
        <EditListing
          show={showEditListing}
          onHide={() => setShowEditListing(false)}
          listing={selectedListing}
          onListingUpdated={handleListingUpdated}
        />
      )}

      <NewListing
        show={showNewListing}
        onHide={() => setShowNewListing(false)}
        onListingAdded={handleListingAdded}
      />
    </>
  );
};

export default UserProfile;