// pages/UserProfile.jsx
import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs } from "react-bootstrap"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { productsAPI, favoritesAPI } from "../api/api"
import EditListing from "../components/EditListing"
import NewListing from "../components/NewListing"
import ProductCard from "./ProductCard"
import ProductDetailsModal from "./ProductDetailsModal"

export default function UserProfile() {
	const { user } = useAuth()
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState("listings")
	const [userListings, setUserListings] = useState([])
	const [userFavorites, setUserFavorites] = useState([])
	const [loading, setLoading] = useState(true)
	// const [favoritesLoading, setFavoritesLoading] = useState(false)
	const [showEditListing, setShowEditListing] = useState(false)
	const [showNewListing, setShowNewListing] = useState(false)
	const [selectedListing, setSelectedListing] = useState(null)
	const [showProductDetails, setShowProductDetails] = useState(false)

	// Redirect if not logged in
	useEffect(() => {
		if (!user) {
			navigate("/")
		}
	}, [user, navigate])

	// Fetch user's own products and favorites
	useEffect(() => {
		const fetchUserData = async () => {
			if (!user) return

			try {
				console.log("Fetching user data for user:", user)

				// Fetch user's listings
				const listingsResponse = await productsAPI.getUserProducts()
				console.log("User listings response:", listingsResponse)
				setUserListings(listingsResponse || [])

				// Fetch user's favorites
				try {
					const favoritesResponse = await favoritesAPI.getUserFavorites()
					console.log("User favorites response:", favoritesResponse)
					setUserFavorites(favoritesResponse || [])
				} catch (favError) {
					console.error("Error fetching favorites:", favError)
					setUserFavorites([])
				}
			} catch (error) {
				console.error("Error fetching user data:", error)
				setUserListings([])
				setUserFavorites([])
			} finally {
				setLoading(false)
			}
		}

		fetchUserData()
	}, [user])

	//! DUPLICATE CODE ALREADY HANDLED IN PRODUCT CARD
	// Handle removing from favorites
	// const handleRemoveFromFavorites = async (productId) => {
	// 	setFavoritesLoading(true)
	// 	try {
	// 		await favoritesAPI.removeFromFavorites(productId)
	// 		// Remove from local state
	// 		setUserFavorites((prev) =>
	// 			prev.filter(
	// 				(fav) => fav._id !== productId && fav.product?._id !== productId,
	// 			),
	// 		)
	// 	} catch (error) {
	// 		console.error("Error removing from favorites:", error)
	// 		alert("Failed to remove from favorites")
	// 	} finally {
	// 		setFavoritesLoading(false)
	// 	}
	// }

	// Handle product detail view
	const handleViewDetails = (listing) => {
		console.log("Received listing data:", listing)
		console.log("Listing keys:", Object.keys(listing))
		setSelectedListing(listing)
		setShowProductDetails(true)
	}

	// Handle edit listing
	const handleEditListing = (listing) => {
		setSelectedListing(listing)
		setShowEditListing(true)
	}

	// Handle delete listing
	// Updated UserProfile.jsx - handleDeleteListing function with better error handling

	const handleDeleteListing = async (listingId) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this listing? This action cannot be undone.",
			)
		) {
			return
		}

		try {
			console.log("Attempting to delete listing:", listingId)
			console.log("Current user:", user)

			// Show loading state
			const listingElement = document.querySelector(
				`[data-listing-id="${listingId}"]`,
			)
			if (listingElement) {
				listingElement.style.opacity = "0.5"
			}

			const response = await productsAPI.deleteProduct(listingId)
			console.log("Delete response:", response)

			// Remove from local state only after successful deletion
			setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))

			// Show success message
			alert("Listing deleted successfully!")
		} catch (error) {
			console.error("Error deleting listing:", error)

			// Reset loading state
			const listingElement = document.querySelector(
				`[data-listing-id="${listingId}"]`,
			)
			if (listingElement) {
				listingElement.style.opacity = "1"
			}

			// Show specific error message
			let errorMessage = "Failed to delete listing. "

			if (error.message.includes("403")) {
				errorMessage += "You do not have permission to delete this listing."
			} else if (error.message.includes("404")) {
				errorMessage += "Listing not found."
			} else if (error.message.includes("401")) {
				errorMessage += "Please log in again."
			} else {
				errorMessage += error.message || "Please try again."
			}

			alert(errorMessage)
		}
	}

	// Handle listing updated
	const handleListingUpdated = (updatedListing) => {
		setUserListings((prev) =>
			prev.map((listing) =>
				listing._id === updatedListing._id ? updatedListing : listing,
			),
		)
		setShowEditListing(false)
	}

	// Handle new listing added
	const handleListingAdded = (newListing) => {
		setUserListings((prev) => [newListing.product || newListing, ...prev])
		setShowNewListing(false)
	}

	const handleGoHome = () => {
		navigate("/")
	}

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
										<div
											className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
											style={{ width: "60px", height: "60px" }}>
											<span className="text-white fw-bold fs-4">
												{user?.firstName?.[0]}
												{user?.lastName?.[0]}
											</span>
										</div>
										<div>
											<h3 className="mb-1">
												{user?.firstName} {user?.lastName}
											</h3>
											<p className="text-muted mb-0">{user?.email}</p>
											<Badge
												bg={user?.isAdmin ? "warning" : "success"}
												className="mt-1">
												{user?.isAdmin ? "Admin" : "Member"}
											</Badge>
										</div>
									</div>
								</Col>
								<Col md={4} className="text-md-end">
									<Button variant="success" onClick={handleGoHome} className="me-2">
										Browse All Listings
									</Button>
									<Button variant="primary" onClick={() => setShowNewListing(true)}>
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
								{userListings.filter((item) => item.isActive).length}
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
								className="mb-3">
								<Tab
									eventKey="listings"
									title={`My Listings (${userListings.length})`}>
									<Row>
										{userListings.map((listing) => (
											<Col md={6} lg={4} key={listing._id} className="mb-3">
												<Card className="h-100 border-0 shadow-sm">
													<div
														style={{ height: "200px", backgroundColor: "#f8f9fa" }}
														className="d-flex align-items-center justify-content-center">
														{listing.images && listing.images.length > 0 ? (
															<img
																src={listing.images[0].url}
																alt={listing.name}
																style={{
																	width: "100%",
																	height: "100%",
																	objectFit: "cover",
																}}
															/>
														) : (
															<span className="text-muted">📷 No Image</span>
														)}
													</div>
													<Card.Body>
														<div className="d-flex justify-content-between align-items-start mb-2">
															<h6 className="mb-0">{listing.name}</h6>
															<Badge bg={listing.isActive ? "success" : "secondary"}>
																{listing.isActive ? "Active" : "Inactive"}
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
																onClick={() => handleEditListing(listing)}>
																Edit
															</Button>
															<Button
																variant="outline-danger"
																size="sm"
																onClick={() => handleDeleteListing(listing._id)}>
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
											<p className="text-muted">
												Start selling by creating your first listing!
											</p>
											<Button
												variant="primary"
												onClick={() => setShowNewListing(true)}>
												+ Add Your First Listing
											</Button>
										</div>
									)}
								</Tab>

								<Tab
									eventKey="favorites"
									title={`Favorites (${userFavorites.length})`}>
									<Row>
										{userFavorites.map((favorite) => {
											const product = favorite.product || favorite
											return (
												//REUSING PRODUCT CARD
												<Col key={product._id} sm={6} lg={4} xl={3} className="mb-4">
													<ProductCard
														product={product}
														onViewDetails={handleViewDetails}
													/>
												</Col>
											)
										})}
									</Row>
									{userFavorites.length === 0 && (
										<div className="text-center py-5">
											<h5 className="text-muted">No favorites yet</h5>
											<p className="text-muted">
												Browse listings and save your favorites!
											</p>
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
			{/* Product Details Modal */}
			<ProductDetailsModal
				show={showProductDetails}
				onHide={() => setShowProductDetails(false)}
				product={selectedListing}
			/>
			{/* Edit Listing Modal */}
			{showEditListing && selectedListing && (
				<EditListing
					show={showEditListing}
					onHide={() => setShowEditListing(false)}
					listing={selectedListing}
					onListingUpdated={handleListingUpdated}
				/>
			)}
			{/* New Listing Modal */}
			<NewListing
				show={showNewListing}
				onHide={() => setShowNewListing(false)}
				onListingAdded={handleListingAdded}
			/>
		</Container>
	)
}
