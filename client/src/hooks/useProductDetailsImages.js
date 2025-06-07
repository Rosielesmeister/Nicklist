// hooks/useProductDetailsImages.js
import { useState } from "react"

export const useProductDetailsImages = () => {
	const [activeImageIndex, setActiveImageIndex] = useState(0)

	// Handle thumbnail click
	const handleThumbnailClick = (index) => {
		setActiveImageIndex(index)
	}

	// Reset to first image
	const resetImageIndex = () => {
		setActiveImageIndex(0)
	}

	return {
		activeImageIndex,
		handleThumbnailClick,
		resetImageIndex
	}
}