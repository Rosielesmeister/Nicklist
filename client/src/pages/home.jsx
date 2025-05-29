import React, { useEffect, useState } from "react"
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Spinner,
	Badge,
} from "react-bootstrap"
import { productsAPI } from "../api/api"
import ProductDetails from "../components/ProductDetails"

const Home = () => {
	const [products, setProducts] = useState([])
	const [searchTerm, setSearchTerm] = useState("")
	const [categoryFilter, setCategoryFilter] = useState("")
	const [regionFilter, setRegionFilter] = useState("")
	const [stateFilter, setStateFilter] = useState("")
	const [zipcodeFilter, setZipcodeFilter] = useState("")
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(0)
	const itemsPerPage = 20 //sets amount of products seen for each page!

	// Modal state
	const [showDetailsModal, setShowDetailsModal] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)

	const categories = [
		"Electronics",
		"Home Appliances",
		"cars/trucks",
		"Motorcycles",
		"Bicycles",
		"Real Estate",
		"Fashion",
		"Toys",
		"Sports",
		"health & Beauty",
		"animals",
		"Furniture",
		"Clothing",
		"Books",
		"Services",
		"Misc",
	]
	const regions = ["North", "South", "East", "West", "Central"]

	// US States array
	const states = [
		"Alabama",
		"Alaska",
		"Arizona",
		"Arkansas",
		"California",
		"Colorado",
		"Connecticut",
		"Delaware",
		"Florida",
		"Georgia",
		"Hawaii",
		"Idaho",
		"Illinois",
		"Indiana",
		"Iowa",
		"Kansas",
		"Kentucky",
		"Louisiana",
		"Maine",
		"Maryland",
		"Massachusetts",
		"Michigan",
		"Minnesota",
		"Mississippi",
		"Missouri",
		"Montana",
		"Nebraska",
		"Nevada",
		"New Hampshire",
		"New Jersey",
		"New Mexico",
		"New York",
		"North Carolina",
		"North Dakota",
		"Ohio",
		"Oklahoma",
		"Oregon",
		"Pennsylvania",
		"Rhode Island",
		"South Carolina",
		"South Dakota",
		"Tennessee",
		"Texas",
		"Utah",
		"Vermont",
		"Virginia",
		"Washington",
		"West Virginia",
		"Wisconsin",
		"Wyoming",
	]

	useEffect(() => {
		fetchProducts()
	}, [])

	const fetchProducts = async () => {
		try {
			const response = await productsAPI.getAllProducts({ limit: 1000 })
			setProducts(response.data || response || [])
		} catch (error) {
			console.error("Error fetching products:", error)
			setProducts([])
		} finally {
			setLoading(false)
		}
	}

	const filteredProducts = products.filter((product) => {
		const matchesSearch =
			searchTerm === "" ||
			(product.name
				? product.name.toLowerCase().includes(searchTerm.toLowerCase())
				: false) ||
			(product.description
				? product.description.toLowerCase().includes(searchTerm.toLowerCase())
				: false)
		const matchesCategory = !categoryFilter || product.category === categoryFilter
		const matchesRegion = !regionFilter || product.region === regionFilter
		const matchesState = !stateFilter || product.state === stateFilter
		const matchesZipcode =
			!zipcodeFilter ||
			(product.zipcode && product.zipcode.toString().includes(zipcodeFilter))

		return (
			matchesSearch &&
			matchesCategory &&
			matchesRegion &&
			matchesState &&
			matchesZipcode
		)
	})

	const paginatedProducts = filteredProducts.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage,
	)

	const clearFilters = () => {
		setSearchTerm("")
		setCategoryFilter("")
		setRegionFilter("")
		setStateFilter("")
		setZipcodeFilter("")
	}

	const handleViewDetails = (product) => {
		setSelectedProduct(product)
		setShowDetailsModal(true)
	}

	const handleCloseModal = () => {
		setShowDetailsModal(false)
		setSelectedProduct(null)
	}

	const formatPrice = (price) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price)
	}

	const truncateText = (text, maxLength = 100) => {
		if (!text || text.length <= maxLength) return text
		return text.substring(0, maxLength) + "..."
	}

	if (loading) {
		return (
			<Container className="text-center py-5">
				<Spinner
					animation="border"
					role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
				<p className="mt-2">Loading listings...</p>
			</Container>
		)
	}

	return (
		<Container>
			<Row>
				<Col>
					<h1 className="mb-4">Browse Listings</h1>

					{/* Search and Filter Card */}
					<Card className="mb-4 shadow-sm">
						<Card.Body>
							<Row className="mb-3">
								<Col
									md={6}
									lg={4}>
									<Form.Control
										type="text"
										placeholder="Search listings..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</Col>
								<Col
									md={6}
									lg={4}>
									<Form.Control
										type="text"
										placeholder="Search by zipcode..."
										value={zipcodeFilter}
										onChange={(e) => setZipcodeFilter(e.target.value)}
									/>
								</Col>
								<Col
									md={6}
									lg={4}>
									<Button
										variant="outline-secondary"
										onClick={clearFilters}
										className="w-100">
										Clear Filters
									</Button>
								</Col>
							</Row>
							<Row>
								<Col
									md={6}
									lg={3}>
									<Form.Select
										value={categoryFilter}
										onChange={(e) => setCategoryFilter(e.target.value)}>
										<option value="">All Categories</option>
										{categories.map((category) => (
											<option
												key={category}
												value={category}>
												{category}
											</option>
										))}
									</Form.Select>
								</Col>
								<Col
									md={6}
									lg={3}>
									<Form.Select
										value={regionFilter}
										onChange={(e) => setRegionFilter(e.target.value)}>
										<option value="">All Regions</option>
										{regions.map((region) => (
											<option
												key={region}
												value={region}>
												{region}
											</option>
										))}
									</Form.Select>
								</Col>
								<Col
									md={6}
									lg={3}>
									<Form.Select
										value={stateFilter}
										onChange={(e) => setStateFilter(e.target.value)}>
										<option value="">All States</option>
										{states.map((state) => (
											<option
												key={state}
												value={state}>
												{state}
											</option>
										))}
									</Form.Select>
								</Col>
								<Col
									md={6}
									lg={3}>
									<div className="text-muted small d-flex align-items-center justify-content-center h-100">
										Showing ${currentPage * itemsPerPage + 1}-$
										{Math.min(
											(currentPage + 1) * itemsPerPage,
											filteredProducts.length,
										)}{" "}
										of ${filteredProducts.length} listings
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

					{/* Products Grid */}
					<Row>
						{paginatedProducts.map((product) => (
							<Col
								key={product._id}
								md={6}
								lg={4}
								className="mb-4">
								<Card className="h-100 shadow-sm hover-shadow">
									{/* Product Image */}
									{product.images && product.images.length > 0 ? (
										<Card.Img
											variant="top"
											src={product.images[0].url}
											style={{
												height: "200px",
												objectFit: "cover",
												cursor: "pointer",
											}}
											onClick={() => handleViewDetails(product)}
										/>
									) : (
										<div
											className="d-flex align-items-center justify-content-center bg-light"
											style={{ height: "200px", cursor: "pointer" }}
											onClick={() => handleViewDetails(product)}>
											<i className="fas fa-image fa-2x text-muted"></i>
										</div>
									)}

									<Card.Body className="d-flex flex-column">
										{/* Product Name - Fixed to use 'name' instead of 'title' */}
										<Card.Title
											className="mb-2"
											style={{ cursor: "pointer" }}
											onClick={() => handleViewDetails(product)}>
											{product.name}
										</Card.Title>

										{/* Price */}
										<div className="mb-2">
											<h5 className="text-success mb-0">
												{formatPrice(product.price)}
											</h5>
										</div>

										{/* Description */}
										<Card.Text className="text-muted flex-grow-1">
											{truncateText(product.description)}
										</Card.Text>

										{/* Category Badge */}
										<div className="mb-2">
											<Badge bg="primary">{product.category}</Badge>
											{product.isActive ? (
												<Badge
													bg="success"
													className="ms-1">
													Available
												</Badge>
											) : (
												<Badge
													bg="secondary"
													className="ms-1">
													Sold
												</Badge>
											)}
										</div>

										{/* Location and Date */}
										<div className="d-flex justify-content-between align-items-center mb-3">
											<small className="text-muted">
												📍 {product.city}, {product.state}
											</small>
											<small className="text-muted">
												{new Date(product.createdAt).toLocaleDateString()}
											</small>
										</div>

										{/* Action Button */}
										<Button
											variant="primary"
											onClick={() => handleViewDetails(product)}
											className="w-100">
											View Details
										</Button>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
					<div className="text-center mt-3 mb-4">
						<Button
							size="sm"
							variant="outline-primary"
							disabled={currentPage === 0}
							onClick={() => setCurrentPage((p) => p - 1)}
							className="me-2">
							Previous
						</Button>

						<Button
							size="sm"
							variant="primary"
							disabled={(currentPage + 1) * itemsPerPage >= filteredProducts.length}
							onClick={() => setCurrentPage((p) => p + 1)}>
							Next
						</Button>
					</div>
					{/* No Results Message */}
					{filteredProducts.length === 0 && !loading && (
						<Row>
							<Col className="text-center py-5">
								<i className="fas fa-search fa-3x text-muted mb-3"></i>
								<h4>No listings found</h4>
								<p className="text-muted">
									Try adjusting your search filters or browse all categories
								</p>
								<Button
									variant="outline-primary"
									onClick={clearFilters}>
									Show All Listings
								</Button>
							</Col>
						</Row>
					)}
				</Col>
			</Row>

			{/* Product Details Modal */}
			<ProductDetails
				show={showDetailsModal}
				onHide={handleCloseModal}
				product={selectedProduct}
			/>
		</Container>
	)
}

export default Home
