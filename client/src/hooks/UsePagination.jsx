// src/pages/Home/hooks/usePagination.js

import { useState, useEffect, useMemo } from "react";
import { PAGE_CONFIG } from "../constants/HomeConstant";

export const usePagination = (filteredProducts, filters) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination data
  const paginationData = useMemo(() => {
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / PAGE_CONFIG.PRODUCTS_PER_PAGE);
    const indexOfFirstProduct = (currentPage - 1) * PAGE_CONFIG.PRODUCTS_PER_PAGE;
    const indexOfLastProduct = currentPage * PAGE_CONFIG.PRODUCTS_PER_PAGE;

    return {
      totalItems,
      totalPages,
      indexOfFirstProduct,
      indexOfLastProduct,
    };
  }, [filteredProducts.length, currentPage]);

  // Get current page products
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(
      paginationData.indexOfFirstProduct,
      paginationData.indexOfLastProduct
    );
  }, [filteredProducts, paginationData]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage,
    currentProducts,
    paginationData,
    handlePageChange,
  };
};