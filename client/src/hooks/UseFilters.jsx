import { useState, useMemo } from "react"
import {
	getInitialFilters,
	useDebounce,
	matchesSearch,
	matchesPriceRange,
} from "../utils/HomeUtils"
import { PAGE_CONFIG } from "../components/common/Constant"

export const useFilters = (products) => {
	const [filters, setFilters] = useState(getInitialFilters())

	// Debounced search for better performance
	const debouncedSearchTerm = useDebounce(
		filters.searchTerm,
		PAGE_CONFIG.SEARCH_DEBOUNCE_MS,
	)

	// Filter products based on all criteria
	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			return (
				matchesSearch(product, debouncedSearchTerm) &&
				(!filters.selectedCategory ||
					product.category === filters.selectedCategory) &&
				(!filters.selectedState || product.state === filters.selectedState) &&
				(!filters.selectedRegion || product.region === filters.selectedRegion) &&
				matchesPriceRange(product, filters.priceRange)
			)
		})
	}, [products, debouncedSearchTerm, filters])

	// Check if any filters are active
	const hasActiveFilters = useMemo(() => {
		return !!(
			filters.searchTerm ||
			filters.selectedCategory ||
			filters.selectedState ||
			filters.selectedRegion ||
			filters.priceRange.min ||
			filters.priceRange.max
		)
	}, [filters])

	// Handle filter changes
	const handleFilterChange = (filterType, value) => {
		setFilters((prev) => ({
			...prev,
			[filterType]: value,
		}))
	}

	// Handle price range changes
	const handlePriceRangeChange = (field, value) => {
		setFilters((prev) => ({
			...prev,
			priceRange: {
				...prev.priceRange,
				[field]: value,
			},
		}))
	}

	// Clear all filters
	const clearAllFilters = () => {
		setFilters(getInitialFilters())
	}

	// Return everything the component needs
	return {
		filters, // Current filter state
		filteredProducts, // Products after applying all filters
		hasActiveFilters, // Boolean - are any filters active?
		handleFilterChange, // Function - update a filter
		handlePriceRangeChange, // Function - update price range
		clearAllFilters, // Function - reset all filters
	}
}
