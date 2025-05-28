// components/UnifiedNavbar.jsx
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const UnifiedNavbar = () => {
    const { user, logout, setShowLogin, setShowRegister } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home after logout
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleFavoritesClick = () => {
        navigate('/profile'); // Navigate to profile page which has favorites tab
    };

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand 
                    onClick={handleHomeClick} 
                    style={{ cursor: 'pointer' }}
                    className="fw-bold"
                >
                    Nicklist
                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <Nav.Link 
                                    onClick={handleHomeClick}
                                    style={{ cursor: 'pointer' }}
                                    className={location.pathname === '/' ? 'active' : ''}
                                >
                                    Home
                                </Nav.Link>
                                <Nav.Link 
                                    onClick={handleFavoritesClick}
                                    style={{ cursor: 'pointer' }}
                                    className={location.pathname === '/profile' ? 'active' : ''}
                                >
                                    My Favorites
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav className="ms-auto">
                        {user ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Welcome, {user.firstName}!
                                </Navbar.Text>
                                <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="outline-light" 
                                    className="me-2" 
                                    onClick={handleLoginClick}
                                >
                                    Login
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleRegisterClick}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default UnifiedNavbar;