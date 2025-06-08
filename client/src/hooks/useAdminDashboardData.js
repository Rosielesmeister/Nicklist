// hooks/useAdminDashboardData.js
import { useState, useEffect } from "react"
import { adminAPI } from "../api/api"
import { formatApiError } from "../utils/adminDashboardHelpers"
import { DASHBOARD_TABS } from "../components/common/Constant"

export const useAdminDashboardData = (activeTab) => {
	const [stats, setStats] = useState({})
	const [users, setUsers] = useState([])
	const [products, setProducts] = useState([])
	const [recentActivity, setRecentActivity] = useState({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	// Get dashboard statistics
	const fetchStats = async () => {
		try {
			setLoading(true)
			const data = await adminAPI.getStats()
			setStats(data)
		} catch (err) {
			setError(formatApiError(err, "fetch stats"))
		} finally {
			setLoading(false)
		}
	}

	// Get all users for the users tab
	const fetchUsers = async () => {
		try {
			setLoading(true)
			const data = await adminAPI.getAllUsers()
			setUsers(data)
		} catch (err) {
			setError(formatApiError(err, "fetch users"))
		} finally {
			setLoading(false)
		}
	}

	// Get all products for the products tab
	const fetchProducts = async () => {
		try {
			setLoading(true)
			const data = await adminAPI.getAllProducts()
			setProducts(data)
		} catch (err) {
			setError(formatApiError(err, "fetch products"))
		} finally {
			setLoading(false)
		}
	}

	// Get recent activity for the overview tab
	const fetchRecentActivity = async () => {
		try {
			setLoading(true)
			const data = await adminAPI.getRecentActivity()
			setRecentActivity(data)
		} catch (err) {
			setError(formatApiError(err, "fetch recent activity"))
		} finally {
			setLoading(false)
		}
	}

	// Clear error
	const clearError = () => {
		setError("")
	}

	// When component first loads, get stats and recent activity
	useEffect(() => {
		fetchStats()
		fetchRecentActivity()
	}, [])

	// When user changes tabs, load appropriate data
	useEffect(() => {
		if (activeTab === DASHBOARD_TABS.USERS) {
			fetchUsers()
		} else if (activeTab === DASHBOARD_TABS.PRODUCTS) {
			fetchProducts()
		}
	}, [activeTab])

	return {
		// Data
		stats,
		users,
		products,
		recentActivity,
		
		// State
		loading,
		error,
		
		// Actions
		setUsers,
		setProducts,
		setStats,
		fetchStats,
		clearError,
	}
}