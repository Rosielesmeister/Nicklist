import { Navbar, Nav, Button } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import Login from "./Login"
import Register from "./Register"

export default function Auth() {
	// Get auth state and functions from our custom hook
	const { user, logout, setShowLogin, setShowRegister, showLogin, showRegister } =
		useAuth()

	return (
		<>
			{/* Main navigation bar - dark theme, collapsible on mobile */}
			<Navbar
				bg="dark"
				variant="dark"
				expand="lg">
				<Navbar.Brand>Alan'sCollapsibleNavBar</Navbar.Brand>

				{/* Hamburger menu for mobile */}
				<Navbar.Toggle />

				<Navbar.Collapse>
					{/* Push nav items to the right */}
					<Nav className="ms-auto">
						{/* Show different options based on login status */}
						{user ? (
							<Button onClick={logout}>Logout</Button>
						) : (
							<>
								{/* Trigger login modal */}
								<Button onClick={() => setShowLogin(true)}>Login</Button>

								{/* Trigger register modal */}
								<Button onClick={() => setShowRegister(true)}>Sign Up</Button>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			{/* Modal components - only render when their show prop is true */}
			<Login
				show={showLogin}
				onHide={() => setShowLogin(false)}
			/>
			<Register
				show={showRegister}
				onHide={() => setShowRegister(false)}
			/>
		</>
	)
}
