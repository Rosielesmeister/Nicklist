// components/auth/Register.jsx
import React, { useState } from "react"
import { Modal, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import { authAPI } from "../../api/api"
import "bootstrap/dist/css/bootstrap.min.css"

const Register = () => {
	const { showRegister, setShowRegister, login, setShowLogin } = useAuth()
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	})
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
		// Clear error when user starts typing
		if (error) setError("")
	}

	const validateForm = () => {
		if (!formData.firstName.trim()) {
			setError("First name is required")
			return false
		}
		if (!formData.lastName.trim()) {
			setError("Last name is required")
			return false
		}
		if (!formData.email.trim()) {
			setError("Email is required")
			return false
		}
		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long")
			return false
		}
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match")
			return false
		}
		return true
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		if (!validateForm()) {
			return
		}

		setLoading(true)

		try {
			const { confirmPassword, ...registrationData } = formData
			const response = await authAPI.register(registrationData)
			login(response)
			setShowRegister(false)
			resetForm()
		} catch (err) {
			setError(err.message || "Registration failed. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	const resetForm = () => {
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		})
		setError("")
	}

	const handleClose = () => {
		resetForm()
		setShowRegister(false)
	}

	const switchToLogin = () => {
		resetForm()
		setShowRegister(false)
		setShowLogin(true)
	}

	return (
		<Modal show={showRegister} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Create Your Account</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{error && (
					<Alert variant="danger" className="mb-3">
						{error}
					</Alert>
				)}

				<Form onSubmit={handleSubmit}>
					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>First Name</Form.Label>
								<Form.Control
									type="text"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									placeholder="Enter your first name"
									required
									disabled={loading}
								/>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Last Name</Form.Label>
								<Form.Control
									type="text"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									placeholder="Enter your last name"
									required
									disabled={loading}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3">
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Enter your email"
							required
							disabled={loading}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Enter your password"
							required
							disabled={loading}
							minLength={6}
						/>
						<Form.Text className="text-muted">
							Password must be at least 6 characters long.
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleInputChange}
							placeholder="Confirm your password"
							required
							disabled={loading}
						/>
					</Form.Group>

					<Button
						variant="primary"
						type="submit"
						className="w-100"
						disabled={loading}>
						{loading ? (
							<>
								<Spinner size="sm" className="me-2" />
								Creating Account...
							</>
						) : (
							"Create Account"
						)}
					</Button>
				</Form>

				<div className="text-center mt-3">
					<span className="text-muted">Already have an account? </span>
					<Button
						variant="link"
						className="p-0"
						onClick={switchToLogin}
						disabled={loading}>
						Login here
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default Register
