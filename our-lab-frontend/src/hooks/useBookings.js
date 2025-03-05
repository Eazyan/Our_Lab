import { useState, useEffect } from 'react';
import { getDevices, getBookings, createBooking, confirmBooking, cancelBooking } from '../utils/api.js';
import { toast } from 'react-toastify';

const useBookings = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBookings = async () => {
    try {
      const bookingsData = await getBookings();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error);
      toast.error('Не удалось загрузить бронирования');
      setBookings([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesData = await getDevices();
        setDevices(Array.isArray(devicesData) ? devicesData : []);
        await fetchBookings();
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Не удалось загрузить данные');
        setDevices([]);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking => {
      if (filter === 'all') return true;
      if (filter === 'pending') return booking.status === 'Ожидает подтверждения';
      if (filter === 'cancelled') return booking.status === 'Отменено';
      return true;
    });
    setFilteredBookings(filtered);
  }, [bookings, filter]);

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
  };

  const handleBookingSuccess = async (startTime, endTime) => {
    if (!selectedDevice) {
      toast.error("Выберите прибор для бронирования");
      return;
    }
    
    try {
      const deviceIdNumber = parseInt(selectedDevice, 10);
      
      if (isNaN(deviceIdNumber)) {
        toast.error("Некорректный ID прибора");
        return;
      }
      
      const selectedDeviceObj = devices.find((device) => device.id === deviceIdNumber);
      
      if (!selectedDeviceObj) {
        toast.error(`Прибор с ID ${deviceIdNumber} не найден`);
        return;
      }
      
      const newBooking = {
        device_id: deviceIdNumber,
        start_time: startTime,
        end_time: endTime
      };
      
      await createBooking(newBooking);
      await fetchBookings();
      setShowForm(false);
      toast.success('Бронирование успешно создано!');
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      
      if (error.response) {
        toast.error(`Ошибка: ${error.response.data?.detail || error.message}`);
      } else {
        toast.error(`Ошибка: ${error.message}`);
      }
    }
  };
    
  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
      await fetchBookings();
      toast.success('Бронирование отменено');
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
      toast.error('Не удалось отменить бронирование');
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await confirmBooking(id);
      await fetchBookings();
      toast.success('Бронирование подтверждено');
    } catch (error) {
      console.error('Ошибка при подтверждении бронирования:', error);
      toast.error('Не удалось подтвердить бронирование');
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  return {
    devices,
    selectedDevice,
    bookings: filteredBookings,
    filter,
    isLoading,
    showForm,
    selectedBooking,
    showModal,
    setFilter,
    setShowForm,
    setSelectedBooking,
    setShowModal,
    handleDeviceChange,
    handleBookingSuccess,
    handleCancelBooking,
    handleConfirmBooking,
    handleBookingClick
  };
};

export default useBookings; 