import React, { useState } from "react"
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom" 

export default function Login({ show, onHide }) {
	const { login } = useAuth()
	const navigate = useNavigate() 
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setIsLoading(true)

		try {
			const formData = new FormData(e.target)
			const email = formData.get("email")
			const password = formData.get("password")

			console.log("Attempting login with:", { email, password: "***" })

			const response = await fetch("http://localhost:5000/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			})

			console.log("Response status:", response.status)
			
			const data = await response.json()
			console.log("Response data:", data)

			if (response.ok) {
				console.log("Login successful, calling login function")
				login(data)
				navigate('/me') 
				onHide()
				e.target.reset()
			} else {
				console.log("Login failed:", data.message)
				setError(data.message || "Login failed. Please try again.")
			}
		} catch (err) {
			console.error("Login error:", err)
			setError("Network error. Please check your connection.")
		} finally {
			setIsLoading(false)
		}
	}

	const handleHide = () => {
		setError("")
		onHide()
	}

	return (
		<Modal show={show} onHide={handleHide} backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{error && (
					<Alert variant="danger" className="mb-3">
						{error}
					</Alert>
				)}
				
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter your email"
							name="email"
							required
							disabled={isLoading}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Enter your password"
							name="password"
							required
							disabled={isLoading}
						/>
					</Form.Group>

					<Button
						variant="primary"
						type="submit"
						className="w-100"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									className="me-2"
								/>
								Logging in...
							</>
						) : (
							"Login"
						)}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}