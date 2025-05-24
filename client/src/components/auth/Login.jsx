import { Modal, Form, Button } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"

export default function Login({ show, onHide }) {
	const { login } = useAuth()

	const handleSubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData(e.target)
		const email = formData.get("email")
		const password = formData.get("password")

		const response = await fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		})

		if (response.ok) {
			const userData = await response.json()
			login(userData)
			onHide()
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
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					{/* Email input with name attribute */}
					<Form.Group className="mb-3">
						<Form.Control
							type="email"
							placeholder="Email"
							name="email"
							required
						/>
					</Form.Group>

					{/* Password input with name attribute */}
					<Form.Group className="mb-3">
						<Form.Control
							type="password"
							placeholder="Password"
							name="password"
							required
						/>
					</Form.Group>

					<Button
						variant="primary"
						type="submit"
						className="w-100">
						Login
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}
