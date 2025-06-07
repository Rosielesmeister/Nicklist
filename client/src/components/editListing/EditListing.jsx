import React from "react"
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// Hooks
import { useEditListingForm } from "../../hooks/useEditListingForm"
import { useListingImages } from "../../hooks/useListingImages"
import { useListingUpdate } from "../../hooks/useListingUpdate"

// Components
import BasicInfoForm from "./BasicInfoForm"
import LocationForm from "./LocationForm"
import DescriptionForm from "./DescriptionForm"
import ImageUploadSection from "./ImageUploadSection"

// Utils
import { hasValidationErrors } from "../../utils/editListingValidation"

const EditListing = ({ show, onHide, listing, onListingUpdated }) => {
	// Custom hooks for state management
	const {
		formData,
		setFormData,
		error,
		handleInputChange,
		validateForm,
		resetForm,
		setErrorMessage,
		clearError
	} = useEditListingForm(listing, show)

	const {
		uploadedImages,
		handleImageUploadSuccess,
		handleImageUploadError,
		removeImage,
		resetImages
	} = useListingImages(listing, show, setFormData)

	const {
		isLoading,
		updateListing
	} = useListingUpdate()

	// Handle image upload with error handling
	const handleImageUpload = (imageInfo) => {
		try {
			handleImageUploadSuccess(imageInfo)
			clearError()
		} catch (error) {
			setErrorMessage(error.message)
		}
	}

	// Handle image upload errors
	const handleImageError = (error) => {
		try {
			handleImageUploadError(error)
		} catch (err) {
			setErrorMessage(err.message)
		}
	}

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault()
		clearError()

		// Validate form first
		if (!validateForm(uploadedImages)) {
			return
		}

		try {
			const updatedListing = await updateListing(listing, formData, uploadedImages)

			// Notify parent component
			if (onListingUpdated) {
				onListingUpdated(updatedListing)
			}

			// Close modal
			handleClose()
		} catch (err) {
			setErrorMessage(err.message)
		}
	}

	// Handle modal close
	const handleClose = () => {
		resetForm()
		resetImages()
		onHide()
	}

	// Don't render if no listing provided
	if (!listing) return null

	return (
		<Modal show={show} onHide={handleClose} size="lg" backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title>Edit Listing: {listing.name}</Modal.Title>
			</Modal.Header>

			<Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
				{/* Error Alert */}
				{error && (
					<Alert variant="danger" className="mb-3">
						<i className="bi bi-exclamation-triangle-fill me-2"></i>
						{error}
					</Alert>
				)}

				<Form onSubmit={handleSubmit}>
					{/* Basic Information */}
					<BasicInfoForm
						formData={formData}
						onChange={handleInputChange}
						isLoading={isLoading}
					/>

					{/* Location Information */}
					<LocationForm
						formData={formData}
						onChange={handleInputChange}
						isLoading={isLoading}
					/>

					{/* Description */}
					<DescriptionForm
						formData={formData}
						onChange={handleInputChange}
						isLoading={isLoading}
					/>

					{/* Images */}
					<ImageUploadSection
						uploadedImages={uploadedImages}
						onUploadSuccess={handleImageUpload}
						onUploadError={handleImageError}
						onRemoveImage={removeImage}
						isLoading={isLoading}
					/>
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose} disabled={isLoading}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleSubmit}
					disabled={isLoading || hasValidationErrors(formData)}>
					{isLoading ? (
						<>
							<Spinner size="sm" className="me-2" />
							Updating Listing...
						</>
					) : (
						"Update Listing"
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditListing