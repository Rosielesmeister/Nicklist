export const PAGE_CONFIG = {
    PRODUCTS_PER_PAGE: 12,
    MAX_PAGINATION_BUTTONS: 5,
    SEARCH_DEBOUNCE_MS: 300,
  };
  
  export const CATEGORIES = [
    "Electronics", "Home Appliances", "Cars/Trucks", "Motorcycles", "Bicycles",
    "Real Estate", "Fashion", "Toys", "Sports", "Health & Beauty", "Animals",
    "Furniture", "Clothing", "Books", "Services", "Miscellaneous",
  ];
  
  export const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming",
  ];
  
  export const REGIONS = ["North", "South", "East", "West", "Central"];
  
  export const MESSAGES = {
    loading: "Loading products...",
    error: "Failed to load products. Please try again.",
    noProducts: "No products found",
    noProductsInitial: "No products have been listed yet.",
    noProductsFiltered: "Try adjusting your search criteria.",
    firstListingCTA: "Be the first to list something!",
    addListing: "Add Listing",
    clearFilters: "Clear All",
    searchPlaceholder: "Search products...",
  };
  
  export const FILTER_LABELS = {
    search: "Search",
    category: "Category",
    priceRange: "Price Range",
    state: "State", 
    region: "Region",
    allCategories: "All Categories",
    allStates: "All States",
    allRegions: "All Regions",
    minPrice: "Min",
    maxPrice: "Max",
  };

  
  export const VALIDATION_RULES = {
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 500,
    MAX_IMAGES: 5,
    MIN_PRICE: 0.01,
  }

  // constants/uiConfig.js

export const UI_CONFIG = {
	DESCRIPTION_MAX_LENGTH: 80,
	IMAGE_HEIGHT: "200px",
	DEFAULT_MESSAGE_TEMPLATE: (productName) =>
		`Hi! I'm interested in your listing "${productName}". Is it still available?`,
}

// Placeholder image as base64
export const PLACEHOLDER_IMAGE =
	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGYwZjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlMGUwZTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="

  // constants/productDetailsConfig.js

export const UI_CONFIG_PRODUCTS = {
	MAIN_IMAGE_HEIGHT: "300px",
	THUMBNAIL_SIZE: "60px",
	MODAL_SIZE: "lg",
	BORDER_RADIUS: "8px",
	THUMBNAIL_BORDER_RADIUS: "4px",
}

export const CONTACT_TEMPLATE = {
	subject: (productName) => `Interested in: ${productName}`,
	body: (productName, price) =>
		`Hi,\n\nI'm interested in your listing "${productName}" priced at $${price}.\n\nPlease let me know if it's still available.\n\nThanks!`,
}

export const DEFAULT_STYLES = {
	imageContainer: {
		backgroundColor: "#f8f9fa",
		borderRadius: UI_CONFIG.BORDER_RADIUS,
		overflow: "hidden",
	},
	noImageContainer: {
		backgroundColor: "#f8f9fa",
		borderRadius: UI_CONFIG.BORDER_RADIUS,
	},
}

export const PLACEHOLDER_IMAGES = {
	NO_IMAGE: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg=="
}

// constants/orderSuccessConfig.js

export const UI_CONFIG_ORDER_SUCCESS = {
	SUCCESS_ICON_SIZE: 80,
	PRODUCT_IMAGE_SIZE: "80px",
	REDIRECT_DELAY: 3000, // milliseconds
}

export const DATE_FORMAT_OPTIONS = {
	ORDER_DATE: {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	},
	DELIVERY_DATE: {
		weekday: "long",
		month: "long",
		day: "numeric",
	},
}

export const NEXT_STEPS = [
	"You'll receive an email confirmation shortly",
	"The seller will be notified of your order",
	"You'll be contacted about delivery arrangements",
	"Track your order status in your account",
]

export const SUCCESS_MESSAGES = {
	TITLE: "Order Placed Successfully!",
	SUBTITLE: "Thank you for your purchase! Your order has been confirmed.",
	NO_ORDER_TITLE: "No order information found",
	NO_ORDER_MESSAGE: "Redirecting you to the homepage...",
	NEXT_STEPS_TITLE: "What happens next?",
}

export const STORAGE_KEYS = {
	LAST_ORDER: "lastOrder",
}