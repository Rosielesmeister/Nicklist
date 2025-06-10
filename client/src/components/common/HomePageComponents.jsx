import React from "react"
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Alert,
	Spinner,
	Pagination,
} from "react-bootstrap"
import { Search, Filter, Plus, Package, X } from "lucide-react"
import ProductCard from "../ProductCard/ProductCard" // Import your existing sophisticated ProductCard
import {
	CATEGORIES,
	US_STATES,
	REGIONS,
	MESSAGES,
	FILTER_LABELS,
	PAGE_CONFIG,
} from "./Constant"

// =============================================================================
// LOADING STATE COMPONENT
// =============================================================================
export const LoadingState = () => (
	<Container className="text-center mt-5">
		<Spinner animation="border" role="status" className="mb-3">
			<span className="visually-hidden">Loading...</span>
		</Spinner>
		<div>{MESSAGES.loading}</div>
	</Container>
)

// =============================================================================
// PAGE HEADER COMPONENT
// =============================================================================
export const PageHeader = ({ user, onShowNewListing }) => (
	<Row className="mb-4">
		<Col>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<div>
					<h2 className="mb-0 d-flex align-items-center">
						<Package size={28} className="me-2 text-primary" />
						Nicklist Marketplace
					</h2>
					<p className="text-muted mb-0">Find great deals in your area</p>
				</div>
				{user && (
					<Button
						variant="primary"
						onClick={onShowNewListing}
						className="d-flex align-items-center gap-2">
						<Plus size={16} />
						{MESSAGES.addListing}
					</Button>
				)}
			</div>
		</Col>
	</Row>
)

// =============================================================================
// ERROR ALERT COMPONENT
// =============================================================================
export const ErrorAlert = ({ error, onClearError, onRetry }) => {
	if (!error) return null

	return (
		<Row className="mb-4">
			<Col>
				<Alert variant="danger" dismissible onClose={onClearError}>
					<i className="bi bi-exclamation-triangle-fill me-2"></i>
					{error}
					<Button
						variant="outline-danger"
						size="sm"
						className="ms-3"
						onClick={onRetry}>
						Try Again
					</Button>
				</Alert>
			</Col>
		</Row>
	)
}

// =============================================================================
// FILTERS SIDEBAR COMPONENT
// =============================================================================
export const FiltersSidebar = ({
	filters,
	hasActiveFilters,
	onFilterChange,
	onPriceRangeChange,
	onClearFilters,
}) => (
	<Col lg={3} className="mb-4">
		<Card className="border-0 shadow-sm">
			<Card.Header className="bg-white border-0">
				<div className="d-flex justify-content-between align-items-center">
					<h5 className="mb-0 d-flex align-items-center">
						<Filter size={18} className="me-2" />
						Filters
					</h5>
					{hasActiveFilters && (
						<Button
							variant="outline-secondary"
							size="sm"
							onClick={onClearFilters}
							className="d-flex align-items-center">
							<X size={14} className="me-1" />
							{MESSAGES.clearFilters}
						</Button>
					)}
				</div>
			</Card.Header>
			<Card.Body>
				{/* Search */}
				<Form.Group className="mb-3">
					<Form.Label>{FILTER_LABELS.search}</Form.Label>
					<div className="position-relative">
						<Form.Control
							type="text"
							placeholder={MESSAGES.searchPlaceholder}
							value={filters.searchTerm}
							onChange={(e) => onFilterChange("searchTerm", e.target.value)}
						/>
						<Search
							size={16}
							className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
						/>
					</div>
				</Form.Group>

				{/* Category Filter */}
				<Form.Group className="mb-3">
					<Form.Label>{FILTER_LABELS.category}</Form.Label>
					<Form.Select
						value={filters.selectedCategory}
						onChange={(e) => onFilterChange("selectedCategory", e.target.value)}>
						<option value="">{FILTER_LABELS.allCategories}</option>
						{CATEGORIES.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</Form.Select>
				</Form.Group>

				{/* Price Range */}
				<Form.Group className="mb-3">
					<Form.Label>{FILTER_LABELS.priceRange}</Form.Label>
					<Row>
						<Col>
							<Form.Control
								type="number"
								placeholder={FILTER_LABELS.minPrice}
								value={filters.priceRange.min}
								onChange={(e) => onPriceRangeChange("min", e.target.value)}
								min="0"
								step="0.01"
							/>
						</Col>
						<Col>
							<Form.Control
								type="number"
								placeholder={FILTER_LABELS.maxPrice}
								value={filters.priceRange.max}
								onChange={(e) => onPriceRangeChange("max", e.target.value)}
								min="0"
								step="0.01"
							/>
						</Col>
					</Row>
				</Form.Group>

				{/* State Filter */}
				<Form.Group className="mb-3">
					<Form.Label>{FILTER_LABELS.state}</Form.Label>
					<Form.Select
						value={filters.selectedState}
						onChange={(e) => onFilterChange("selectedState", e.target.value)}>
						<option value="">{FILTER_LABELS.allStates}</option>
						{US_STATES.map((state) => (
							<option key={state} value={state}>
								{state}
							</option>
						))}
					</Form.Select>
				</Form.Group>

				{/* Region Filter */}
				<Form.Group className="mb-3">
					<Form.Label>{FILTER_LABELS.region}</Form.Label>
					<Form.Select
						value={filters.selectedRegion}
						onChange={(e) => onFilterChange("selectedRegion", e.target.value)}>
						<option value="">{FILTER_LABELS.allRegions}</option>
						{REGIONS.map((region) => (
							<option key={region} value={region}>
								{region}
							</option>
						))}
					</Form.Select>
				</Form.Group>
			</Card.Body>
		</Card>
	</Col>
)

// =============================================================================
// PRODUCTS HEADER COMPONENT
// =============================================================================
export const ProductsHeader = ({ totalItems, totalProducts, hasActiveFilters }) => (
	<div className="d-flex justify-content-between align-items-center mb-3">
		<h5 className="mb-0">
			{totalItems} Product{totalItems !== 1 ? "s" : ""} Found
			{hasActiveFilters && (
				<small className="text-muted ms-2">
					(filtered from {totalProducts} total)
				</small>
			)}
		</h5>
	</div>
)

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================
export const EmptyState = ({
	user,
	products,
	filteredProducts,
	hasActiveFilters,
	onShowNewListing,
	onClearFilters,
}) => (
	<Card className="border-0 shadow-sm">
		<Card.Body className="text-center py-5">
			<div className="text-muted mb-3" style={{ fontSize: "4rem" }}>
				🔍
			</div>
			<h5 className="text-muted">{MESSAGES.noProducts}</h5>
			<p className="text-muted">
				{products.length === 0
					? MESSAGES.noProductsInitial
					: MESSAGES.noProductsFiltered}
			</p>
			{user && products.length === 0 && (
				<Button variant="primary" onClick={onShowNewListing}>
					{MESSAGES.firstListingCTA}
				</Button>
			)}
			{hasActiveFilters && filteredProducts.length === 0 && (
				<Button variant="outline-secondary" onClick={onClearFilters}>
					<X size={16} className="me-1" />
					{MESSAGES.clearFilters}
				</Button>
			)}
		</Card.Body>
	</Card>
)

// =============================================================================
// PRODUCTS GRID COMPONENT
// =============================================================================
export const ProductsGrid = ({
	filteredProducts,
	currentProducts,
	onViewDetails,
	user,
	products,
	hasActiveFilters,
	onShowNewListing,
	onClearFilters,
}) => {
	if (filteredProducts.length === 0) {
		return (
			<EmptyState
				user={user}
				products={products}
				filteredProducts={filteredProducts}
				hasActiveFilters={hasActiveFilters}
				onShowNewListing={onShowNewListing}
				onClearFilters={onClearFilters}
			/>
		)
	}

	return (
		<Row>
			{currentProducts.map((product) => (
				<Col key={product._id} sm={6} lg={4} xl={3} className="mb-4">
					<ProductCard product={product} onViewDetails={onViewDetails} />
				</Col>
			))}
		</Row>
	)
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================
export const PaginationComponent = ({
	paginationData,
	currentPage,
	onPageChange,
}) => {
	if (paginationData.totalPages <= 1) return null

	const getPaginationItems = () => {
		const items = []
		const totalPages = paginationData.totalPages

		// Always show first page
		items.push(
			<Pagination.Item
				key={1}
				active={1 === currentPage}
				onClick={() => onPageChange(1)}>
				1
			</Pagination.Item>,
		)

		// Show ellipsis if needed
		if (currentPage > 3) {
			items.push(<Pagination.Ellipsis key="ellipsis-start" />)
		}

		// Show pages around current page
		const start = Math.max(2, currentPage - 1)
		const end = Math.min(totalPages - 1, currentPage + 1)

		for (let i = start; i <= end; i++) {
			if (i !== 1 && i !== totalPages) {
				items.push(
					<Pagination.Item
						key={i}
						active={i === currentPage}
						onClick={() => onPageChange(i)}>
						{i}
					</Pagination.Item>,
				)
			}
		}

		// Show ellipsis if needed
		if (currentPage < totalPages - 2) {
			items.push(<Pagination.Ellipsis key="ellipsis-end" />)
		}

		// Always show last page (if more than 1 page)
		if (totalPages > 1) {
			items.push(
				<Pagination.Item
					key={totalPages}
					active={totalPages === currentPage}
					onClick={() => onPageChange(totalPages)}>
					{totalPages}
				</Pagination.Item>,
			)
		}

		return items
	}

	return (
		<Row className="mt-4">
			<Col className="d-flex justify-content-center">
				<Pagination>
					<Pagination.Prev
						onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
						disabled={currentPage === 1}
					/>

					{getPaginationItems()}

					<Pagination.Next
						onClick={() =>
							onPageChange(Math.min(currentPage + 1, paginationData.totalPages))
						}
						disabled={currentPage === paginationData.totalPages}
					/>
				</Pagination>
			</Col>
		</Row>
	)
}