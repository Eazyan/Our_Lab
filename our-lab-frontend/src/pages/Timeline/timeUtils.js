export const formatTime = (dateString) => {
  if (!dateString) return 'Время не указано';
  
  try {
    const date = new Date(dateString);
    const hours = (date.getHours()).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    return 'Ошибка времени';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Дата не указана';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return formatter.format(date);
  } catch (error) {
    return 'Ошибка даты';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Ожидает подтверждения';
    case 'confirmed':
      return 'Подтверждено';
    case 'cancelled':
      return 'Отменено';
    case 'completed':
      return 'Завершено';
    default:
      return 'Неизвестный статус';
  }
};

export const getTimeFromDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}; 