// hooks/useOrderSuccessData.js
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { retrieveOrderData, clearStoredOrderData } from "../utils/orderSuccessHelpers"
import { UI_CONFIG_ORDER_SUCCESS } from "../components/common/Constant"

export const useOrderSuccessData = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [orderData, setOrderData] = useState(null)

	useEffect(() => {
		const order = retrieveOrderData(location.state)

		if (order) {
			setOrderData(order)
		} else {
			// If no order data, redirect to home after a delay
			setTimeout(() => {
				navigate("/")
			}, UI_CONFIG_ORDER_SUCCESS.REDIRECT_DELAY)
		}
	}, [location.state, navigate])

	return {
		orderData,
		hasOrderData: !!orderData
	}
}