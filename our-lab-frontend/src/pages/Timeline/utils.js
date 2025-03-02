// Utility functions for the Timeline components

// Format date for display
export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
};

// Format time from date string
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Get color for device
export const getRandomColor = (deviceName) => {
  // Simple hash function for consistent colors
  const hash = deviceName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate HSL color with fixed saturation and lightness for readability
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// Check if booking is within allowed hours (8:30 - 17:00)
export const isWithinBusinessHours = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  
  // Convert to minutes since midnight for easier comparison
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;
  
  // 8:30 = 8*60 + 30 = 510 minutes
  // 17:00 = 17*60 = 1020 minutes
  const businessStartMinutes = 8 * 60 + 30;
  const businessEndMinutes = 17 * 60;
  
  // Check if booking starts and ends within business hours
  return (
    startTimeMinutes >= businessStartMinutes &&
    startTimeMinutes < businessEndMinutes &&
    endTimeMinutes > businessStartMinutes &&
    endTimeMinutes <= businessEndMinutes
  );
}; 