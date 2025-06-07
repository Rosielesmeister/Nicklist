// OrderSuccess/components/SuccessHeader.jsx
import React from "react"
import { CheckCircle } from "lucide-react"
import { UI_CONFIG_ORDER_SUCCESS, SUCCESS_MESSAGES } from "../common/Constant"

const SuccessHeader = () => {
	return (
		<div className="text-center mb-5">
			<CheckCircle size={UI_CONFIG_ORDER_SUCCESS.SUCCESS_ICON_SIZE} className="text-success mb-3" />
			<h1 className="text-success mb-2">{SUCCESS_MESSAGES.TITLE}</h1>
			<p className="lead text-muted">{SUCCESS_MESSAGES.SUBTITLE}</p>
		</div>
	)
}

export default SuccessHeader