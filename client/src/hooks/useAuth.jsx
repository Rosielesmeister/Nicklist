import { useState, useEffect, createContext, useContext } from "react"

// Create the auth context
const AuthContext = createContext()

// Provider component that wraps your app
export const AuthProvider = ({ children }) => {
	// Track current user - null means not logged in
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	// Control visibility of login modal
	const [showLogin, setShowLogin] = useState(false)

	// Control visibility of register modal
	const [showRegister, setShowRegister] = useState(false)

	// Check for existing user on app load
	useEffect(() => {
		const savedUser = localStorage.getItem("user")
		if (savedUser) {
			try {
				setUser(JSON.parse(savedUser))
			} catch (error) {
				console.error("Error parsing saved user data:", error)
				localStorage.removeItem("user") // Clean up invalid data
			}
		}
		setLoading(false)
	}, [])

	// Set user data when they successfully log in
	const login = (userData) => {
		console.log("Setting user in context:", userData)
		setUser(userData)
		localStorage.setItem("user", JSON.stringify(userData))
	}

	// Clear user data on logout
	const logout = () => {
		setUser(null)
		localStorage.removeItem("user")
	}

	const value = {
		user,
		loading,
		login,
		logout,
		showLogin,
		setShowLogin,
		showRegister,
		setShowRegister,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}