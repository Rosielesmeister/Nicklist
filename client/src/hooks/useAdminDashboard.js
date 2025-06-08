// hooks/useAdminDashboard.js
import { useState } from "react"
import { useAdminDashboardData } from "./useAdminDashboardData"
import { useAdminUserManagement } from "./useAdminUserManagement"
import { useAdminProductManagement } from "./useAdminProductManagement"
import { DASHBOARD_TABS } from "../components/common/Constant"

export const useAdminDashboard = () => {
	const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.OVERVIEW)

	// Data management hook
	const {
		stats,
		users,
		products,
		recentActivity,
		loading: dataLoading,
		error,
		setUsers,
		setProducts,
		setStats,
		fetchStats,
		clearError,
	} = useAdminDashboardData(activeTab)

	// User management hook
	const {
		loading: userLoading,
		handleDeleteUser,
		handleToggleUserAdmin,
	} = useAdminUserManagement(users, setUsers, fetchStats, clearError)

	// Product management hook
	const {
		loading: productLoading,
		handleDeleteProduct,
		handleToggleProductActive,
	} = useAdminProductManagement(products, setProducts, fetchStats, clearError)

	// Combined loading state
	const loading = dataLoading || userLoading || productLoading

	return {
		// Tab management
		activeTab,
		setActiveTab,

		// Data
		stats,
		users,
		products,
		recentActivity,

		// State
		loading,
		error,
		clearError,

		// User management
		handleDeleteUser,
		handleToggleUserAdmin,

		// Product management
		handleDeleteProduct,
		handleToggleProductActive,
	}
}