import { useState } from "react"

export const useAuth = () => {
	// Track current user - null means not logged in
	const [user, setUser] = useState(null)

	// Control visibility of login modal
	const [showLogin, setShowLogin] = useState(false)

	// Control visibility of register modal
	const [showRegister, setShowRegister] = useState(false)

	// Set user data when they successfully log in
	const login = (userData) => setUser(userData)

	// Clear user data on logout
	const logout = () => setUser(null)

	// Return all state and functions so components can use them
	return {
		user,
		login,
		logout,
		showLogin,
		setShowLogin,
		showRegister,
		setShowRegister,
	}
}
