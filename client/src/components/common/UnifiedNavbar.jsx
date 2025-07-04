import React, { useState, useEffect } from "react"
import { Navbar, Nav, Button, Container, Badge } from "react-bootstrap"
import { Shield, MessageCircle, User, Home, LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate, useLocation } from "react-router-dom"
import { messagesAPI } from "../../api/api" 
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

const NAVBAR_CONFIG = {
  BRAND_NAME: "Nicklist",
  REFRESH_INTERVAL: 30000, // 30 seconds for message count refresh
  MAX_UNREAD_DISPLAY: 99, // Show "99+" for counts above this
};

const ROUTES = {
  HOME: "/",
  PROFILE: "/profile",
  MESSAGES: "/messages",
  ADMIN: "/admin",
};

const NAV_ITEMS = {
  HOME: { path: ROUTES.HOME, label: "Home", icon: Home },
  PROFILE: { path: ROUTES.PROFILE, label: "My Profile", icon: User },
  MESSAGES: { path: ROUTES.MESSAGES, label: "Messages", icon: MessageCircle },
  ADMIN: { path: ROUTES.ADMIN, label: "Admin Dashboard", icon: Shield },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Format unread count for display
const formatUnreadCount = (count) => {
  if (count === 0) return null;
  if (count > NAVBAR_CONFIG.MAX_UNREAD_DISPLAY)
    return `${NAVBAR_CONFIG.MAX_UNREAD_DISPLAY}+`;
  return count.toString();
};

// Check if current path matches nav item
const isActiveRoute = (currentPath, targetPath) => {
  return currentPath === targetPath;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const UnifiedNavbar = () => {
  const { user, logout, setShowLogin, setShowRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  // Check user permissions and status
  const userStatus = {
    isLoggedIn: !!user,
    isAdmin: user?.isAdmin || false,
    displayName: user?.firstName || user?.name || "User",
    userId: user?._id,
  };

  // Get formatted unread count for display
  const unreadDisplay = formatUnreadCount(unreadCount);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Fetch unread count when user logs in
  useEffect(() => {
    if (userStatus.isLoggedIn) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0); // Reset count when user logs out
    }
  }, [userStatus.isLoggedIn]);

  // Set up periodic refresh of unread count
  useEffect(() => {
    if (!userStatus.isLoggedIn) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, NAVBAR_CONFIG.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [userStatus.isLoggedIn]);

  // =============================================================================
  // API FUNCTIONS
  // =============================================================================

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    if (!userStatus.isLoggedIn) return;

    setLoadingMessages(true);

    try {
      const messages = await messagesAPI.getMessagesForUser();

      // Count unread messages for current user
      const unreadMessages = messages.filter((msg) => {
        const isRecipient =
          msg.recipient === userStatus.userId ||
          msg.recipient?._id === userStatus.userId;
        return !msg.read && isRecipient;
      });

      setUnreadCount(unreadMessages.length);
    } catch (error) {
      console.error("Error fetching unread message count:", error);
      // Don't show error to user for background refresh
      // Could implement toast notifications here instead
    } finally {
      setLoadingMessages(false);
    }
  };

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  // Handle logout
  const handleLogout = () => {
    logout();
    setUnreadCount(0); // Clear unread count
    navigate(ROUTES.HOME);
  };

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Authentication modal handlers
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  // Handle messages click with count refresh
  const handleMessagesClick = () => {
    navigate(ROUTES.MESSAGES);
    // Refresh count when user visits messages page
    setTimeout(() => {
      fetchUnreadCount();
    }, 1000);
  };

  // =============================================================================
  // UI COMPONENTS
  // =============================================================================

  // Brand/Logo component
  const NavbarBrand = () => (
    <Navbar.Brand
      onClick={() => handleNavigation(ROUTES.HOME)}
      style={{ cursor: "pointer" }}
      className="fw-bold d-flex align-items-center"
    >
      <img
        src="/LOGO.png"
        alt="Nicklist Logo"
        style={{
          // Keep ALL your existing styles exactly the same
          height: (() => {
            if (typeof window === "undefined") return "65px";
            if (window.innerWidth < 576) return "65px";
            if (window.innerWidth < 768) return "80px";
            if (window.innerWidth < 992) return "100px";
            return "120px";
          })(),
          width: (() => {
            if (typeof window === "undefined") return "65px";
            if (window.innerWidth < 576) return "65px";
            if (window.innerWidth < 768) return "80px";
            if (window.innerWidth < 992) return "100px";
            return "120px";
          })(),
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "center",
          transform: "scale(1.25)", // Static scale - no hover changes
          border: "3px solid #fff",
          backgroundColor: "transparent",
          boxShadow: `
            0 6px 12px rgba(0, 0, 0, 0.3),
            0 12px 24px rgba(0, 0, 0, 0.2),
            0 24px 48px rgba(0, 0, 0, 0.15),
            0 3px 6px rgba(255, 255, 255, 0.15) inset,
            0 0 30px rgba(40, 167, 69, 0.25),
            0 0 60px rgba(40, 167, 69, 0.1)
          `,
          clipPath: "circle(50% at 50% 50%)",
          marginTop: (() => {
            if (typeof window === "undefined") return "15px";
            if (window.innerWidth < 576) return "15px";
            if (window.innerWidth < 768) return "12px";
            if (window.innerWidth < 992) return "8px";
            return "5px";
          })(),
          marginLeft: (() => {
            if (typeof window === "undefined") return "-15px";
            if (window.innerWidth < 576) return "-15px";
            if (window.innerWidth < 768) return "-20px";
            if (window.innerWidth < 992) return "-25px";
            return "-30px";
          })(),
          marginBottom: (() => {
            if (typeof window === "undefined") return "-10px";
            if (window.innerWidth < 576) return "-10px";
            if (window.innerWidth < 768) return "-15px";
            if (window.innerWidth < 992) return "-20px";
            return "-25px";
          })(),
          marginRight: (() => {
            if (typeof window === "undefined") return "18px";
            if (window.innerWidth < 576) return "15px";
            if (window.innerWidth < 768) return "18px";
            if (window.innerWidth < 992) return "22px";
            return "25px";
          })(),
          transition: "all 0.3s ease",
          display: logoError ? "none" : "block",
          overflow: "hidden",
          filter: "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25)) drop-shadow(0 0 20px rgba(40, 167, 69, 0.2))",
        }}
        onLoad={() => {
          // Only load handling - no hover animations
          setLogoLoaded(true);
          setLogoError(false);
        }}
        onError={(e) => {
          // Only error handling - no hover animations
          setLogoError(true);
          setLogoLoaded(false);
        }}
        // ✅ NO HOVER HANDLERS - Logo won't move on hover
      />
      {NAVBAR_CONFIG.BRAND_NAME}
    </Navbar.Brand>
  );

  // Navigation links for logged-in users
  const UserNavLinks = () => {
    if (!userStatus.isLoggedIn) return null;

    return (
      <>
        <Nav.Link
          onClick={() => handleNavigation(ROUTES.HOME)}
          style={{ cursor: "pointer" }}
          className={
            isActiveRoute(location.pathname, ROUTES.HOME) ? "active" : ""
          }
        >
          <Home size={16} className="me-1" />
          Home
        </Nav.Link>

        <Nav.Link
          onClick={() => handleNavigation(ROUTES.PROFILE)}
          style={{ cursor: "pointer" }}
          className={
            isActiveRoute(location.pathname, ROUTES.PROFILE) ? "active" : ""
          }
        >
          <User size={16} className="me-1" />
          My Profile
        </Nav.Link>

        <Nav.Link
          onClick={handleMessagesClick}
          style={{ cursor: "pointer" }}
          className={
            isActiveRoute(location.pathname, ROUTES.MESSAGES) ? "active" : ""
          }
        >
          <MessageCircle size={16} className="me-1" />
          Messages
          {unreadDisplay && (
            <Badge bg="danger" className="ms-2">
              {unreadDisplay}
            </Badge>
          )}
          {loadingMessages && (
            <span className="ms-1 text-muted">
              <i className="spinner-border spinner-border-sm" role="status"></i>
            </span>
          )}
        </Nav.Link>

        {userStatus.isAdmin && <AdminNavLink />}
      </>
    );
  };

  // Admin navigation link (separate component for clarity)
  const AdminNavLink = () => (
    <Nav.Link
      onClick={() => handleNavigation(ROUTES.ADMIN)}
      style={{ cursor: "pointer" }}
      className={isActiveRoute(location.pathname, ROUTES.ADMIN) ? "active" : ""}
    >
      <Shield size={16} className="me-1" />
      Admin Dashboard
    </Nav.Link>
  );

  // User info and logout section
  const UserSection = () => {
    if (!userStatus.isLoggedIn) return null;

    return (
      <>
        <Navbar.Text className="me-3 d-flex align-items-center">
          <User size={16} className="me-2" />
          Welcome, {userStatus.displayName}!
        </Navbar.Text>
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleLogout}
          className="d-flex align-items-center"
        >
          <LogOut size={16} className="me-1" />
          Logout
        </Button>
      </>
    );
  };

  // Guest authentication buttons
  const GuestSection = () => {
    if (userStatus.isLoggedIn) return null;

    return (
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
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <NavbarBrand />

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left side navigation */}
          <Nav className="me-auto">
            {!userStatus.isLoggedIn && (
              <Nav.Link
                onClick={() => handleNavigation(ROUTES.HOME)}
                style={{ cursor: "pointer" }}
                className={
                  isActiveRoute(location.pathname, ROUTES.HOME) ? "active" : ""
                }
              >
                <Home size={16} className="me-1" />
                Home
              </Nav.Link>
            )}
            <UserNavLinks />
          </Nav>

          {/* Right side authentication */}
          <Nav className="ms-auto">
            <UserSection />
            <GuestSection />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UnifiedNavbar;
