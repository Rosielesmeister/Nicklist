import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Home from "./pages/home";
import UserProfile from "./components/UserProfile";
import Messages from "./pages/Messages"; // ADD THIS IMPORT
import UnifiedNavbar from "./components/UnifiedNavbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NewListing from "./components/NewListing";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Main app content (needs to be inside AuthProvider)
function AppContent() {
  const { user } = useAuth();
  const [showAddListing, setShowAddListing] = useState(false);

  const handleListingAdded = (newListing) => {
    console.log("New listing added:", newListing);
    setShowAddListing(false);
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <UnifiedNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected route for user profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* ADD THIS NEW ROUTE FOR MESSAGES */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Add Listing Modal */}
        {user && (
          <NewListing
            show={showAddListing}
            onHide={() => setShowAddListing(false)}
            onListingAdded={handleListingAdded}
          />
        )}

        {/* Login and Register Modals */}
        <Login />
        <Register />
      </div>
    </Router>
  );
}

export default App;
