import React from "react"
import { Alert } from "react-bootstrap"
import { NEXT_STEPS, SUCCESS_MESSAGES } from "../common/Constant"

const NextSteps = () => {
	return (
		<Alert variant="info">
			<h6>{SUCCESS_MESSAGES.NEXT_STEPS_TITLE}</h6>
			<ul className="mb-0">
				{NEXT_STEPS.map((step, index) => (
					<li key={index}>{step}</li>
				))}
			</ul>
		</Alert>
	)
}

export default NextSteps