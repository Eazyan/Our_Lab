import React, { useState } from 'react';
import axios from 'axios';

const BookingHistory = ({ bookings, devices, setBookings }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  // Функция для редактирования бронирования
  const handleEditClick = (bookingId) => {
    setIsEditing(bookingId);
    const booking = bookings.find((b) => b.id === bookingId);
    setNewStartTime(booking.startTime);
    setNewEndTime(booking.endTime);
  };

  // Функция для сохранения изменений
  const handleSaveClick = async (bookingId) => {
    try {
      const updatedBooking = {
        startTime: newStartTime,
        endTime: newEndTime,
      };

      // Отправляем обновленные данные на сервер
      await axios.patch(`http://localhost:5001/bookings/${bookingId}`, updatedBooking);

      // Обновляем локальное состояние с новыми данными
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
      );

      setBookings(updatedBookings);  // Обновляем состояние на фронте

      setIsEditing(null);  // Закрываем форму редактирования
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      alert('Не удалось сохранить изменения');
    }
  };

  // Функция для удаления бронирования
  const handleDeleteClick = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5001/bookings/${bookingId}`);
      
      // Обновляем локальное состояние после удаления
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error('Ошибка при удалении бронирования:', error);
      alert('Не удалось удалить бронирование');
    }
  };

  return (
    <div>
      <h3>История бронирований</h3>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => {
            const device = devices.find((device) => device.id === booking.deviceId);
            return (
              <li key={booking.id}>
                <p><strong>Прибор:</strong> {device ? device.name : 'Не найден'}</p>
                <p>
                  <strong>Время:</strong> {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                </p>
                <p><strong>Статус:</strong> {booking.status}</p>
                {isEditing === booking.id ? (
                  <div>
                    <label>
                      Время начала:
                      <input
                        type="datetime-local"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                      />
                    </label>
                    <label>
                      Время окончания:
                      <input
                        type="datetime-local"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                      />
                    </label>
                    <button onClick={() => handleSaveClick(booking.id)}>Сохранить</button>
                    <button onClick={() => setIsEditing(null)}>Отменить</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleEditClick(booking.id)}>Редактировать</button>
                    <button onClick={() => handleDeleteClick(booking.id)}>Удалить</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Нет предыдущих бронирований.</p>
      )}
    </div>
  );
};

export default BookingHistory;
