import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Navbar, Nav, Badge, Tab, Tabs } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { postsAPI } from '../api/api' 
import NewListing from './NewListing' 

export default function UserProfile() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('listings')
    const [userListings, setUserListings] = useState([]) 
    const [loading, setLoading] = useState(true)
    const [showAddListing, setShowAddListing] = useState(false)

    // Fetch user listings when component mounts
    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                const response = await postsAPI.getUserPosts() 
                setUserListings(response.data || response || [])
            } catch (error) {
                console.error('Error fetching user listings:', error)
                setUserListings([])
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchUserListings()
        }
    }, [user])

    const handleLogout = () => {
        logout()
        navigate('/') 
    }

    // Filter listings by status
    const activeListings = userListings.filter(item => item.status === 'active')
    const soldListings = userListings.filter(item => item.status === 'sold')

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <div>Loading...</div>
            </Container>
        )
    }

    return (
        <>
            {/* Navigation Bar */}
            <Navbar bg="white" variant="light" expand="lg" className="border-bottom mb-4">
                <Container>
                    <Navbar.Brand href="/" className="fw-bold">
                        YourMarketplace
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Browse Listings</Nav.Link>
                            <Nav.Link href="/me" className="fw-bold text-primary">
                                My Profile
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Navbar.Text className="me-3">
                                Welcome, {user?.firstName}!
                            </Navbar.Text>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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
                                        <Button variant="outline-primary" className="me-2">
                                            Edit Profile
                                        </Button>
                                        <Button variant="primary" onClick={() => setShowAddListing(true)}>
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
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <h4 className="text-primary mb-1">{userListings.length}</h4>
                                <small className="text-muted">Total Listings</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <h4 className="text-success mb-1">{activeListings.length}</h4>
                                <small className="text-muted">Active</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <h4 className="text-warning mb-1">{soldListings.length}</h4>
                                <small className="text-muted">Sold</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <h4 className="text-info mb-1">
                                    {userListings.reduce((total, item) => total + (item.views || 0), 0)}
                                </h4>
                                <small className="text-muted">Total Views</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Listings Tabs */}
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
                                                <Col md={6} lg={4} key={listing._id || listing.id} className="mb-3">
                                                    <Card className="h-100 border-0 shadow-sm">
                                                        <div style={{height: '200px', backgroundColor: '#f8f9fa'}} 
                                                             className="d-flex align-items-center justify-content-center">
                                                            {listing.images && listing.images.length > 0 ? (
                                                                <img 
                                                                    src={listing.images[0].url || listing.images[0]} 
                                                                    alt={listing.title}
                                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                                />
                                                            ) : (
                                                                <span className="text-muted">📷 No Image</span>
                                                            )}
                                                        </div>
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h6 className="mb-0">{listing.title}</h6>
                                                                <Badge bg={listing.status === 'active' ? 'success' : 'secondary'}>
                                                                    {listing.status || 'active'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-muted small mb-2">
                                                                {listing.description && listing.description.length > 100 
                                                                    ? `${listing.description.substring(0, 100)}...` 
                                                                    : listing.description}
                                                            </p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <strong className="text-primary">
                                                                    ${listing.price || 'N/A'}
                                                                </strong>
                                                                <small className="text-muted">
                                                                    {listing.views || 0} views
                                                                </small>
                                                            </div>
                                                            <div className="mt-2">
                                                                <Button variant="outline-primary" size="sm" className="me-2">
                                                                    Edit
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm">
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
                                                <Button variant="primary" onClick={() => setShowAddListing(true)}>
                                                    + Add Your First Listing
                                                </Button>
                                            </div>
                                        )}
                                    </Tab>
                                    
                                    <Tab eventKey="favorites" title="Favorites">
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No favorites yet</h5>
                                            <p className="text-muted">Browse listings and save your favorites here!</p>
                                            <Button variant="outline-primary" href="/">Browse Listings</Button>
                                        </div>
                                    </Tab>
                                    
                                    <Tab eventKey="messages" title="Messages">
                                        <div className="text-center py-5">
                                            <h5 className="text-muted">No messages</h5>
                                            <p className="text-muted">Messages from buyers will appear here.</p>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* New Listing Modal */}
            <NewListing
                show={showAddListing}
                onHide={() => setShowAddListing(false)}
                onListingAdded={(newListing) => {
                    console.log("New listing added:", newListing);
                    // Refresh listings or show success message
                }}
            />
        </>
    )
}