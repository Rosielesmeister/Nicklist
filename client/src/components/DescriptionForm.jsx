import React from "react"
import { Form } from "react-bootstrap"
import { VALIDATION_RULES } from "./common/Constant"
import { getCharacterCounts } from "../utils/newListingValidation"
import CharacterCounter from "./CharacterCounter"

const DescriptionForm = ({ formData, onChange, isLoading }) => {
	const characterCounts = getCharacterCounts(formData)

	return (
		<Form.Group className="mb-3">
			<Form.Label>
				Description *
				<CharacterCounter
					current={characterCounts.description}
					max={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH}
				/>
			</Form.Label>
			<Form.Control
				as="textarea"
				rows={4}
				name="description"
				value={formData.description}
				onChange={onChange}
				placeholder="Describe your item in detail..."
				required
				disabled={isLoading}
				maxLength={VALIDATION_RULES.DESCRIPTION_MAX_LENGTH + 50} // Allow typing a bit over
				className={
					characterCounts.description > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH
						? "is-invalid"
						: ""
				}
			/>
			{characterCounts.description >
				VALIDATION_RULES.DESCRIPTION_MAX_LENGTH && (
				<Form.Control.Feedback type="invalid">
					Description is too long ({characterCounts.description}/
					{VALIDATION_RULES.DESCRIPTION_MAX_LENGTH})
				</Form.Control.Feedback>
			)}
		</Form.Group>
	)
}

export default DescriptionForm