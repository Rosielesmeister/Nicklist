import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth, AuthProvider } from "./hooks/useAuth"
import UserProfile from "./components/UserProfile"
import NewListing from "./components/NewListing"
import Home from "./pages/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import UnifiedNavbar from "./components/UnifiedNavbar"
import "bootstrap/dist/css/bootstrap.min.css"

// Protected route component
function ProtectedRoute({ children }) {
	const { user, loading } = useAuth()
	
	if (loading) {
		return <div>Loading...</div>
	}
	
	return user ? children : <Navigate to="/" replace />
}

// Main app content (needs to be inside AuthProvider)
function AppContent() {
	const { user } = useAuth()
	const [showAddListing, setShowAddListing] = useState(false)

	const handleListingAdded = (newListing) => {
		console.log('New listing added:', newListing)
		setShowAddListing(false)
	}

	return (
		<Router>
			<div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
				{/* Use UnifiedNavbar instead of Auth */}
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
	)
}

// Main App component with AuthProvider wrapper
function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	)
}

export default App