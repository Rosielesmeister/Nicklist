import { useState, useEffect } from "react"

export const useListingImages = (listing, show, setFormData) => {
	const [uploadedImages, setUploadedImages] = useState([])

	// Initialize images when listing changes
	useEffect(() => {
		if (listing && show) {
			setUploadedImages(listing.images || [])
		}
	}, [listing, show])

	// Handle successful image upload
	const handleImageUploadSuccess = (imageInfo) => {
		const newImage = {
			url: imageInfo.secure_url || imageInfo.url,
			public_id: imageInfo.public_id,
		}

		setUploadedImages((prev) => {
			const updated = [...prev, newImage]

			// Also update form data
			setFormData((prevForm) => ({
				...prevForm,
				images: updated,
			}))

			return updated
		})

		console.log("Image uploaded successfully:", newImage)
	}

	// Handle image upload errors
	const handleImageUploadError = (error) => {
		console.error("Image upload error:", error)
		throw new Error("Failed to upload image. Please try again.")
	}

	// Remove an uploaded image
	const removeImage = (indexToRemove) => {
		setUploadedImages((prev) => {
			const updated = prev.filter((_, index) => index !== indexToRemove)

			// Also update form data
			setFormData((prevForm) => ({
				...prevForm,
				images: updated,
			}))

			return updated
		})
	}

	// Reset images
	const resetImages = () => {
		setUploadedImages([])
	}

	return {
		uploadedImages,
		handleImageUploadSuccess,
		handleImageUploadError,
		removeImage,
		resetImages
	}
}