import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Container, Badge } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { messagesAPI } from "../api/api";

const UnifiedNavbar = () => {
  const { user, logout, setShowLogin, setShowRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const messages = await messagesAPI.getMessagesForUser();
      const unread = messages.filter(
        (msg) =>
          !msg.read &&
          (msg.recipient === user._id || msg.recipient?._id === user._id)
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleMessagesClick = () => {
    navigate("/messages");
  };

  const handleAdminClick = () => {
    navigate("/admin"); // Navigate to admin dashboard
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
          style={{ cursor: "pointer" }}
          className="fw-bold d-flex align-items-center"
        >
          <img
            src="/logo.png"
            alt="Nicklist"
            height="40"
            width="auto"
            className="me-2"
            style={{ maxHeight: "50px", objectFit: "contain" }}
          />
          Nicklist
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link
              onClick={handleHomeClick}
              style={{ cursor: "pointer" }}
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Nav.Link>
            {user && (
              <>
                <Nav.Link
                  onClick={handleProfileClick}
                  style={{ cursor: "pointer" }}
                  className={location.pathname === "/profile" ? "active" : ""}
                >
                  My Profile
                </Nav.Link>
                <Nav.Link
                  onClick={handleMessagesClick}
                  style={{ cursor: "pointer" }}
                  className={location.pathname === "/messages" ? "active" : ""}
                >
                  💬 Messages
                  {unreadCount > 0 && (
                    <Badge bg="danger" className="ms-1">
                      {unreadCount}
                    </Badge>
                  )}
                </Nav.Link>
              </>
            )}
            {user && user.isAdmin && (
              <Nav.Link
                onClick={handleAdminClick}
                style={{ cursor: "pointer" }}
                className={location.pathname === "/admin" ? "active" : ""}
              >
                <i className="bi bi-shield-check me-1"></i>
                Admin Dashboard
              </Nav.Link>
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
                <Button variant="primary" onClick={handleRegisterClick}>
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
