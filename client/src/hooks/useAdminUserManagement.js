// hooks/useAdminUserManagement.js
import { useState } from "react"
import { adminAPI } from "../api/api"
import { confirmUserDeletion, formatApiError } from "../utils/adminDashboardHelpers"

export const useAdminUserManagement = (users, setUsers, fetchStats, setError) => {
	const [loading, setLoading] = useState(false)

	// Delete a user account
	const handleDeleteUser = async (userId) => {
		// Ask for confirmation before deleting
		if (!confirmUserDeletion()) {
			return // User clicked "Cancel", so don't delete
		}

		try {
			setLoading(true)
			await adminAPI.deleteUser(userId)
			
			// Update the users list by removing the deleted user
			setUsers(users.filter((user) => user._id !== userId))
			
			// Refresh stats since user count changed
			await fetchStats()
			
			setError("") // Clear any previous errors
		} catch (err) {
			setError(formatApiError(err, "delete user"))
		} finally {
			setLoading(false)
		}
	}

	// Toggle user's admin status (make admin or remove admin)
	const handleToggleUserAdmin = async (userId) => {
		try {
			setLoading(true)
			const data = await adminAPI.toggleUserAdmin(userId)
			
			// Update the specific user in our users list
			setUsers(users.map((user) =>
				user._id === userId 
					? { ...user, isAdmin: data.user.isAdmin } 
					: user
			))
			
			setError("") // Clear any previous errors
		} catch (err) {
			setError(formatApiError(err, "toggle admin status"))
		} finally {
			setLoading(false)
		}
	}

	return {
		loading,
		handleDeleteUser,
		handleToggleUserAdmin,
	}
}