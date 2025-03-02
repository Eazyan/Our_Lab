// apiService.js - Direct API access bypassing environment variables
import { apiUrl } from '../utils/api'; // Импортируем apiUrl

// Используем apiUrl из api.js
const API_BASE_URL = apiUrl;

// Fetch devices
export const fetchDevices = async () => {
  try {
    console.log('Directly fetching devices from:', `${API_BASE_URL}/devices/`);
    
    const response = await fetch(`${API_BASE_URL}/devices/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching devices: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched devices:', data);
    return data;
  } catch (error) {
    console.error('Device fetch error:', error);
    return [];
  }
};

// Fetch bookings
export const fetchBookings = async () => {
  try {
    console.log('Directly fetching bookings from:', `${API_BASE_URL}/bookings/`);
    
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching bookings: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched bookings:', data);
    return data;
  } catch (error) {
    console.error('Booking fetch error:', error);
    return [];
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    console.log('Creating booking with data:', bookingData);
    
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully created booking:', data);
    return data;
  } catch (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
}; 