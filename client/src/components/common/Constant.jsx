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