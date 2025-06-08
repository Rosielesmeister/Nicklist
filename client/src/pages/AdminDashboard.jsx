import React from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../App.css"

// Hooks
import { useAdminDashboard } from "../hooks/useAdminDashboard"

// Components
import { DashboardHeader, LoadingSpinner, ErrorAlert } from "../components/AdminDashboard/UIElements"
import TabNavigation from "../components/AdminDashboard/TabNavigation"
import OverviewTab from "../components/AdminDashboard/OverviewTab"
import UsersTab from "../components/AdminDashboard/UsersTab"
import ProductsTab from "../components/AdminDashboard/ProductsTab"

// Constants
import { DASHBOARD_TABS } from "../components/common/Constant"

const AdminDashboard = () => {
	// Main hook that orchestrates all admin dashboard functionality
	const {
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
	} = useAdminDashboard()

	// Render tab content based on active tab
	const renderTabContent = () => {
		switch (activeTab) {
			case DASHBOARD_TABS.OVERVIEW:
				return <OverviewTab stats={stats} recentActivity={recentActivity} />
			
			case DASHBOARD_TABS.USERS:
				return (
					<UsersTab
						users={users}
						onToggleUserAdmin={handleToggleUserAdmin}
						onDeleteUser={handleDeleteUser}
						loading={loading}
					/>
				)
			
			case DASHBOARD_TABS.PRODUCTS:
				return (
					<ProductsTab
						products={products}
						onToggleProductActive={handleToggleProductActive}
						onDeleteProduct={handleDeleteProduct}
						loading={loading}
					/>
				)
			
			default:
				return <OverviewTab stats={stats} recentActivity={recentActivity} />
		}
	}

	return (
		<div className="container-fluid bg-light min-vh-100 py-4">
			<div className="container">
				{/* Header Section */}
				<DashboardHeader />

				{/* Error Alert */}
				<ErrorAlert error={error} onDismiss={clearError} />

				{/* Loading Indicator */}
				{loading && <LoadingSpinner />}

				{/* Navigation Tabs */}
				<TabNavigation 
					activeTab={activeTab} 
					setActiveTab={setActiveTab} 
					loading={loading} 
				/>

				{/* Tab Content */}
				<div className="tab-content">
					{renderTabContent()}
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard