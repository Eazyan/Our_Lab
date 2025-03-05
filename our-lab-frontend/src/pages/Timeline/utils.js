export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
};

export const formatTime = (date) => {
  if (!date) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const getRandomColor = (deviceName) => {
  const hash = deviceName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 80%)`;
};

export const isWithinBusinessHours = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  
  const startTimeMinutes = startHour * 60 + startMinute;
  const endTimeMinutes = endHour * 60 + endMinute;
  
  const businessStartMinutes = 8 * 60;
  const businessEndMinutes = 17 * 60;
  
  return (
    startTimeMinutes >= businessStartMinutes &&
    startTimeMinutes < businessEndMinutes &&
    endTimeMinutes > businessStartMinutes &&
    endTimeMinutes <= businessEndMinutes
  );
};