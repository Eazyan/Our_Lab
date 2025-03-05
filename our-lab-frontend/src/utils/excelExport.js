import * as XLSX from 'xlsx';

export const exportBookingsToExcel = (bookings, devices, formatDate, formatTime, getStatusText) => {
  const excelData = bookings.map(booking => {
    const device = devices.find(d => d.id === booking.deviceId || d.id === booking.device_id);
    return {
      'Прибор': device ? device.name : 'Неизвестный прибор',
      'Дата': formatDate(booking.startTime || booking.start_time),
      'Время начала': formatTime(booking.startTime || booking.start_time),
      'Время окончания': formatTime(booking.endTime || booking.end_time),
      'Статус': getStatusText(booking.status),
      'Email пользователя': booking.userEmail || 'Не указан'
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Настраиваем ширину колонок
  const colWidths = [
    { wch: 20 }, // Прибор
    { wch: 15 }, // Дата
    { wch: 12 }, // Время начала
    { wch: 12 }, // Время окончания
    { wch: 15 }, // Статус
    { wch: 25 }  // Email пользователя
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Бронирования');
  XLSX.writeFile(wb, 'Бронирования.xlsx');
}; 