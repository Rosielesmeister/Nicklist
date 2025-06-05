import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/UseAuth"
import Home from "./pages/home"
import UserProfile from "./pages/UserProfile"
import Messages from "./pages/Messages"
import UnifiedNavbar from "./components/common/UnifiedNavbar"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import NewListing from "./components/products/NewListing"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

import "./App.css"
import AdminDashboard from "./pages/AdminDashboard"

//!!! We need to add delete any product under admin profile
//!!! Some admin registration

function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	)
}

// Main app content (needs to be inside AuthProvider)
function AppContent() {
	const { user } = useAuth()
	const [showAddListing, setShowAddListing] = useState(false)

	const handleListingAdded = (newListing) => {
		console.log("New listing added:", newListing)
		setShowAddListing(false)
	}

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

					{/* Protected admin-only route for admin dashboard */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute adminOnly={true}>
								<AdminDashboard />
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

export default App
