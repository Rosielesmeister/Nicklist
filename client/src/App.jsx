import React from 'react';
import { useCloudinaryImage } from "./hooks/useCloudinaryImage";
import { AdvancedImage } from '@cloudinary/react'; // Add this import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

function App() {
  const { getOptimizedImage } = useCloudinaryImage("doaflgje");
  const img = getOptimizedImage("cld-sample-5");

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/image" element={<AdvancedImage cldImg={img} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
import React from "react"
import { AdvancedImage } from "@cloudinary/react"
import { useCloudinaryImage } from "./hooks/useCloudinaryImage"
import Auth from "./components/auth/Auth"
import "bootstrap/dist/css/bootstrap.min.css"
const App = () => {
	const { getOptimizedImage } = useCloudinaryImage("doaflgje")
	const img = getOptimizedImage("cld-sample-5")

	return (
		<>
			{/* navbar */}
			<Auth />

			{/* cloudinary */}
			{/* <AdvancedImage cldImg={img} /> */}
		</>
	)
}

export default App;