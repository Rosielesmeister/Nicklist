import { useState, useContext, createContext, useEffect } from "react"
import { authAPI } from "../api/api"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

import "../App.css"

// Create auth context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [showLogin, setShowLogin] = useState(false)
	const [showRegister, setShowRegister] = useState(false)

	// Check for existing token on app load
	useEffect(() => {
		const checkAuthState = async () => {
			try {
				const token = localStorage.getItem("token")
				if (token) {
					// Verify token is still valid by getting current user
					const userData = await authAPI.getCurrentUser()
					if (userData) {
						setUser({ ...userData, token })
					} else {
						// Token invalid, remove it
						localStorage.removeItem("token")
					}
				}
			} catch (error) {
				console.error("Error checking auth state:", error)
				localStorage.removeItem("token")
			} finally {
				setLoading(false)
			}
		}

		checkAuthState()
	}, [])

	const login = (userData) => {
		console.log("Login called with:", userData)
		setUser(userData)
		if (userData.token) {
			localStorage.setItem("token", userData.token)
		}
	}

	const logout = () => {
		console.log("Logout called")
		setUser(null)
		localStorage.removeItem("token")
		authAPI.logout()
	}

	const value = {
		user,
		login,
		logout,
		loading,
		showLogin,
		setShowLogin,
		showRegister,
		setShowRegister,
	}

	console.log("Auth context value:", { user: user?.email, showLogin, showRegister })

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
