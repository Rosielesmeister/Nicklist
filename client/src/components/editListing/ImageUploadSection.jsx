import React from "react"
import { Form, Row, Col, Card, Button } from "react-bootstrap"
import CloudinaryUploadWidget from "../common/CloudinaryUploadWidget"
import { VALIDATION_RULES } from "../common/Constant"

const ImageUploadSection = ({
	uploadedImages,
	onUploadSuccess,
	onUploadError,
	onRemoveImage,
	isLoading
}) => {
	// Image gallery component
	const ImageGallery = () => {
		if (uploadedImages.length === 0) return null

		return (
			<div className="uploaded-images mt-3">
				<Row>
					{uploadedImages.map((image, index) => (
						<Col key={index} md={3} className="mb-3">
							<Card className="h-100">
								<Card.Img
									variant="top"
									src={image.url}
									style={{
										height: "120px",
										objectFit: "cover",
									}}
									alt={`Upload ${index + 1}`}
									onError={(e) => {
										console.error("Image failed to load:", image.url)
										e.target.style.display = "none"
									}}
								/>
								<Card.Body className="p-2">
									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => onRemoveImage(index)}
										disabled={isLoading}
										className="w-100">
										Remove
									</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		)
	}

	return (
		<Form.Group className="mb-3">
			<Form.Label>Images</Form.Label>
			<div className="d-flex align-items-center gap-3 mb-3">
				<CloudinaryUploadWidget
					onUploadSuccess={onUploadSuccess}
					onUploadError={onUploadError}
					multiple={false}
					maxFiles={1}
					folder="marketplace/listings"
					buttonText="Add Image"
					disabled={
						isLoading || uploadedImages.length >= VALIDATION_RULES.MAX_IMAGES
					}
				/>
				<Form.Text className="text-muted">
					Upload up to {VALIDATION_RULES.MAX_IMAGES} images (
					{uploadedImages.length}/{VALIDATION_RULES.MAX_IMAGES})
				</Form.Text>
			</div>

			<ImageGallery />
		</Form.Group>
	)
}

export default ImageUploadSection