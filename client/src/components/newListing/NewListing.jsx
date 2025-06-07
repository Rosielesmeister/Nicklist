import React from "react"
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"

// Hooks
import { useNewListingForm } from "../../hooks/useNewListingForm"
import { useNewListingImages } from "../../hooks/useNewListingImages"
import { useListingCreation } from "../../hooks/useListingCreation"

// Components
import BasicInfoForm from "../BasicInfoForm"
import LocationForm from "../LocationForm" // Reuse from EditListing
import DescriptionForm from "../DescriptionForm"
import ImageUploadSection from "../ImageUploadSection"

// Utils
import { hasValidationErrors } from "../../utils/newListingValidation"

const NewListing = ({ show, onHide, onListingAdded }) => {
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
	} = useNewListingForm()

	const {
		uploadedImages,
		handleImageUploadSuccess,
		handleImageUploadError,
		removeImage,
		resetImages
	} = useNewListingImages(setFormData)

	const {
		isLoading,
		createListing
	} = useListingCreation()

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
			const newListing = await createListing(formData, uploadedImages)

			// Reset form and notify parent
			resetForm()
			resetImages()
			
			if (onListingAdded) {
				onListingAdded(newListing)
			}
			
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

	return (
		<Modal show={show} onHide={handleClose} size="lg" backdrop="static">
			<Modal.Header closeButton>
				<Modal.Title>Add New Listing</Modal.Title>
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

					{/* Location Information - Reuse from EditListing */}
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
							Creating Listing...
						</>
					) : (
						"Create Listing"
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default NewListing