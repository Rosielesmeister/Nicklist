import React, { useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { useAuth } from "../hooks/useAuth"
import { useProducts } from "../hooks/UseProducts"
import { useFilters } from "../hooks/useFilters"
import { usePagination } from "../hooks/usePagination"
import ProductDetailsModal from "../components/ProductDetailsModal/ProductDetailsModal"
import NewListing from "../components/newListing/NewListing"

// All UI components from single file
import {
	LoadingState,
	PageHeader,
	ErrorAlert,
	FiltersSidebar,
	ProductsHeader,
	ProductsGrid,
	PaginationComponent,
} from "../components/common/HomePageComponents"

const Home = () => {
	const { user } = useAuth()

	// Modal state
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [showProductDetails, setShowProductDetails] = useState(false)
	const [showNewListing, setShowNewListing] = useState(false)

	// Custom hooks for data and logic
	const { products, loading, error, fetchProducts, addProduct, clearError } =
		useProducts()
	const {
		filters,
		filteredProducts,
		hasActiveFilters,
		handleFilterChange,
		handlePriceRangeChange,
		clearAllFilters,
	} = useFilters(products)
	const { currentPage, currentProducts, paginationData, handlePageChange } =
		usePagination(filteredProducts, filters)

	// Event handlers
	const handleViewDetails = (product) => {
		setSelectedProduct(product)
		setShowProductDetails(true)
	}

	const handleListingAdded = (newListing) => {
		addProduct(newListing)
		setShowNewListing(false)
	}

	const handleShowNewListing = () => setShowNewListing(true)

	// Show loading state
	if (loading) {
		return <LoadingState />
	}

	return (
		<>
			<Container fluid className="py-4">
				<PageHeader user={user} onShowNewListing={handleShowNewListing} />

				<ErrorAlert
					error={error}
					onClearError={clearError}
					onRetry={fetchProducts}
				/>

				<Row>
					<FiltersSidebar
						filters={filters}
						hasActiveFilters={hasActiveFilters}
						onFilterChange={handleFilterChange}
						onPriceRangeChange={handlePriceRangeChange}
						onClearFilters={clearAllFilters}
					/>

					<Col lg={9}>
						<ProductsHeader
							totalItems={paginationData.totalItems}
							totalProducts={products.length}
							hasActiveFilters={hasActiveFilters}
						/>

						<ProductsGrid
							filteredProducts={filteredProducts}
							currentProducts={currentProducts}
							onViewDetails={handleViewDetails}
							user={user}
							products={products}
							hasActiveFilters={hasActiveFilters}
							onShowNewListing={handleShowNewListing}
							onClearFilters={clearAllFilters}
						/>
					</Col>
				</Row>

				<PaginationComponent
					paginationData={paginationData}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				/>
			</Container>

			{/* Modals */}
			<ProductDetailsModal
				show={showProductDetails}
				onHide={() => setShowProductDetails(false)}
				product={selectedProduct}
			/>

			{user && (
				<NewListing
					show={showNewListing}
					onHide={() => setShowNewListing(false)}
					onListingAdded={handleListingAdded}
				/>
			)}
		</>
	)
}

export default Home
