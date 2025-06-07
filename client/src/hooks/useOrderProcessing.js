import { useState } from "react";

export const useOrderProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const submitOrder = async ({ formData, product, pricing }) => {
    if (!product) throw new Error("Product information is missing");

    setProcessing(true);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Create mock order
      const order = {
        _id: `ORD-${Date.now()}`,
        id: `ORD-${Date.now()}`,
        status: "confirmed",
        total: pricing?.total || product.price,
        trackingNumber: `TRK${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        product: product._id,
        shippingAddress: formData,
        contactInfo: { email: formData.email, phone: formData.phone },
      };

      setCompletedOrder(order);
      setOrderSuccess(true);
      return order;
    } catch (error) {
      throw new Error(`Failed to process order: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const resetOrderState = () => {
    setProcessing(false);
    setOrderSuccess(false);
    setCompletedOrder(null);
  };

  return {
    processing,
    orderSuccess,
    completedOrder,
    submitOrder,
    resetOrderState,
  };
};
