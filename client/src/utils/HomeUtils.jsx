
import { useState, useEffect } from "react";

// Debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Check if product matches search criteria
export const matchesSearch = (product, searchTerm) => {
  if (!searchTerm) return true;
  
  const term = searchTerm.toLowerCase();
  return (
    product.name?.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term) ||
    product.category?.toLowerCase().includes(term)
  );
};

// Check if product matches price range
export const matchesPriceRange = (product, priceRange) => {
  const price = product.price;
  const min = priceRange.min ? parseFloat(priceRange.min) : null;
  const max = priceRange.max ? parseFloat(priceRange.max) : null;
  
  if (min !== null && price < min) return false;
  if (max !== null && price > max) return false;
  return true;
};

// Get initial filter state
export const getInitialFilters = () => ({
  searchTerm: "",
  selectedCategory: "",
  selectedState: "",
  selectedRegion: "",
  priceRange: { min: "", max: "" },
});