import { Modal, Form, Button } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"

//import port variable from frontend ENV file
const API_BASE_URL = `http://localhost:${import.meta.env.VITE_API_PORT || 5000}` 

export default function Register({ show, onHide }) {
	const { login } = useAuth()

	const handleSubmit = async (e) => {
		// Prevent page refresh on form submit
		e.preventDefault()

		// Get form values
		const formData = new FormData(e.target)
		const firstName = formData.get("firstName")
		const lastName = formData.get("lastName")
		const email = formData.get("email")
		const password = formData.get("password")

		const response = await fetch(`${API_BASE_URL}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ firstName, lastName, email, password }),
		})

		// Handle response
		if (response.ok) {
			const userData = await response.json()
			login(userData)
			// Auto-login after registration
			onHide() // Close the modal
		} else {
			const error = await response.json()
			alert(error.message)
		}
	}

	return (
		<Modal
			show={show}
			onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Sign Up</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					{/* First Name input */}
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							placeholder="First Name"
							name="firstName"
							required
						/>
					</Form.Group>

					{/* Last Name input */}
					<Form.Group className="mb-3">
						<Form.Control
							type="text"
							placeholder="Last Name"
							name="lastName"
							required
						/>
					</Form.Group>

					{/* Email input */}
					<Form.Group className="mb-3">
						<Form.Control
							type="email"
							placeholder="Email"
							name="email"
							required
						/>
					</Form.Group>

					{/* Password input */}
					<Form.Group className="mb-3">
						<Form.Control
							type="password"
							placeholder="Password"
							name="password"
							required
						/>
					</Form.Group>

					{/* Submit button triggers handleSubmit */}
					<Button
						variant="primary"
						type="submit"
						className="w-100">
						Sign Up
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}
