import React from "react"
import { useCloudinaryImage } from "./hooks/useCloudinaryImage"
import { AdvancedImage } from "@cloudinary/react" // Add this import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
//TODO import Navbar from "./components/Navbar"
<<<<<<< HEAD
import Home from "./pages/Home"
=======
//TODO import Home from "./pages/Home"
>>>>>>> main
//TODO import Dashboard from "./pages/Dashboard"
//TODO import CreatePost from "./pages/CreatePost"s
//TODO import EditPost from "./pages/EditPost"
import Auth from "./components/auth/Auth"
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
	const { getOptimizedImage } = useCloudinaryImage("doaflgje")
	const img = getOptimizedImage("cld-sample-5")

	return (
		<Router>
<<<<<<< HEAD
			<div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
				{/* Layuout components */}
				<Auth />
				{/* Layout End */}
				<Routes>
					{/* TODO: Uncomment each page when completed */}
					<Route
						path="/"
						element={<Home />}
					/>
					{/* <Route
        path="/login"
        element={<Login />}
    /> */}
					{/* <Route
        path="/register"
        element={<Register />}
    /> */}
					{/* <Route
        path="/dashboard"
        element={<Dashboard />}
    /> */}
					{/* <Route
        path="/create"
        element={<CreatePost />}
    /> */}
					{/* <Route
        path="/edit/:id"
        element={<EditPost />}
    /> */}
					{/* <Route
        path="/image"
        element={<AdvancedImage cldImg={img} />}
    /> */}
				</Routes>
=======
			<div className="min-h-screen bg-gray-50">
				<main className="container mx-auto px-4 py-8">
					{/* Layuout components */}
					<Auth />
					<div style={{ backgroundColor: "red", padding: "20px" }}>
						<h1>APP IS WORKING</h1>
					</div>
					{/* Layout End */}
					<Routes>
						{/* TODO: Uncomment each page when completed */}
						{/* <Route
							path="/"
							element={<Home />}
						/>
						<Route
							path="/login"
							element={<Login />}
						/>
						<Route
							path="/register"
							element={<Register />}
						/>
						<Route
							path="/dashboard"
							element={<Dashboard />}
						/>
						<Route
							path="/create"
							element={<CreatePost />}
						/>
						<Route
							path="/edit/:id"
							element={<EditPost />}
						/>
						<Route
							path="/image"
							element={<AdvancedImage cldImg={img} />}
						/> */}
					</Routes>
				</main>
>>>>>>> main
			</div>
		</Router>
	)
}

export default App
