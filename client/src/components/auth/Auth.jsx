import { Navbar, Nav, Button } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import Login from "./Login"
import Register from "./Register"

export default function Auth() {
	const { user, logout, setShowLogin, setShowRegister, showLogin, showRegister } =
		useAuth()
		return (
			<>
				<Navbar bg="dark" variant="dark" expand="lg">
					<Navbar.Brand>Alan'sCollapsibleNavBar</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse>
						<Nav className="ms-auto">
							{user ? (
								<Button onClick={logout}>Logout</Button>
							) : (
								<>
									<Button onClick={() => setShowLogin(true)}>Login</Button>
									<Button onClick={() => setShowRegister(true)}>Sign Up</Button>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
	
				<Login show={showLogin} onHide={() => setShowLogin(false)} />
				<Register show={showRegister} onHide={() => setShowRegister(false)} />
			</>
		);
	}