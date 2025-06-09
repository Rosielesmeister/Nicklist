import { useState } from "react"

export const useNewListingImages = (setFormData) => {
	const [uploadedImages, setUploadedImages] = useState([])

	// Handle successful image upload
	const handleImageUploadSuccess = (imageInfo) => {
		console.log("Full Cloudinary response:", imageInfo)

		const newImage = {
			url: imageInfo.secure_url || imageInfo.url,
			public_id: imageInfo.public_id,
		}

		// Validate the image URL
		if (!newImage.url) {
			console.error("No URL found in image response:", imageInfo)
			throw new Error("Failed to get image URL from upload")
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