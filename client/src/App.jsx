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

export default App
