// utils/priceCalculations.js

export const calculatePricing = (productPrice = 0) => {
	const tax = productPrice * 0.08 // 8% tax
	const shipping = productPrice > 50 ? 0 : 9.99 // Free shipping over $50
	const total = productPrice + tax + shipping

	return { 
		productPrice, 
		tax, 
		shipping, 
		total 
	}
}