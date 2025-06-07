// EditListing/components/CharacterCounter.jsx
import React from "react"

const CharacterCounter = ({ current, max }) => {
	const isOverLimit = current > max
	return (
		<span className={`text-muted ms-2 ${isOverLimit ? "text-danger" : ""}`}>
			({current}/{max})
		</span>
	)
}

export default CharacterCounter