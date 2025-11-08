import React, { createContext, useState, useCallback } from 'react';

export const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    tour: null,
    participants: [],
    date: null,
    numberOfPeople: 1,
    specialRequests: '',
    contactInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
    },
    paymentMethod: null,
    promoCode: null,
  });

  // Initialize booking with tour
  const initializeBooking = useCallback((tour) => {
    setBookingData((prev) => ({
      ...prev,
      tour,
    }));
    setBookingStep(1);
  }, []);

  // Update booking data
  const updateBookingData = useCallback((data) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  // Move to next step
  const nextStep = useCallback(() => {
    setBookingStep((prev) => prev + 1);
  }, []);

  // Move to previous step
  const previousStep = useCallback(() => {
    setBookingStep((prev) => Math.max(1, prev - 1));
  }, []);

  // Go to specific step
  const goToStep = useCallback((step) => {
    setBookingStep(step);
  }, []);

  // Reset booking
  const resetBooking = useCallback(() => {
    setCurrentBooking(null);
    setBookingStep(1);
    setBookingData({
      tour: null,
      participants: [],
      date: null,
      numberOfPeople: 1,
      specialRequests: '',
      contactInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
      },
      paymentMethod: null,
      promoCode: null,
    });
  }, []);

  // Calculate total price
  const calculateTotalPrice = useCallback(() => {
    if (!bookingData.tour) return 0;
    
    let total = bookingData.tour.price * bookingData.numberOfPeople;
    
    // Apply promo code discount if available
    if (bookingData.promoCode?.discount) {
      const discount = bookingData.promoCode.discountType === 'percentage'
        ? (total * bookingData.promoCode.discount) / 100
        : bookingData.promoCode.discount;
      total -= discount;
    }
    
    return Math.max(0, total);
  }, [bookingData]);

  // Set current booking (for viewing/managing existing booking)
  const setBooking = useCallback((booking) => {
    setCurrentBooking(booking);
  }, []);

  const value = {
    currentBooking,
    bookingStep,
    bookingData,
    initializeBooking,
    updateBookingData,
    nextStep,
    previousStep,
    goToStep,
    resetBooking,
    calculateTotalPrice,
    setBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export default BookingContext;
