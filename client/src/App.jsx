import React from "react"
import { useCloudinaryImage } from "./hooks/useCloudinaryImage"

const App = () => {
	const { getOptimizedImage } = useCloudinaryImage("doaflgje")
	const img = getOptimizedImage("cld-sample-5")

	return <AdvancedImage cldImg={img} />
}

export default App
