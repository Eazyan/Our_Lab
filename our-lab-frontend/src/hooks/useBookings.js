import { useState, useEffect } from 'react';
import { bookingService, deviceService } from '../services/api';
import { toast } from 'react-toastify';

const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getBookings();
            setBookings(data);
        } catch (err) {
            setError('Ошибка загрузки бронирований');
            console.error('Ошибка:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDevices = async () => {
        try {
            const data = await deviceService.getDevices();
            setDevices(data);
        } catch (err) {
            setError('Ошибка загрузки приборов');
            console.error('Ошибка:', err);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchDevices();
    }, []);

    useEffect(() => {
        const filtered = bookings.filter(booking => {
            if (filter === 'all') return true;
            if (filter === 'pending') return booking.status === 'pending';
            if (filter === 'cancelled') return booking.status === 'cancelled';
            return true;
        }).map(booking => ({
            ...booking,
            device: {
                id: booking.deviceId,
                name: booking.deviceName
            },
            start_time: booking.startTime,
            end_time: booking.endTime
        }));
        setFilteredBookings(filtered);
    }, [bookings, filter]);

    const handleDeviceChange = (e) => {
        setSelectedDevice(e.target.value);
    };

    const createBooking = async (newBooking) => {
        try {
            await bookingService.createBooking(newBooking);
            await fetchBookings();
        } catch (err) {
            setError('Ошибка создания бронирования');
            console.error('Ошибка:', err);
            throw err;
        }
    };

    const updateBooking = async (id, data) => {
        try {
            await bookingService.updateBooking(id, data);
            await fetchBookings();
        } catch (err) {
            setError('Ошибка обновления бронирования');
            console.error('Ошибка:', err);
            throw err;
        }
    };

    const deleteBooking = async (id) => {
        try {
            await bookingService.deleteBooking(id);
            await fetchBookings();
        } catch (err) {
            setError('Ошибка удаления бронирования');
            console.error('Ошибка:', err);
            throw err;
        }
    };

    const confirmBooking = async (id) => {
        try {
            await bookingService.confirmBooking(id);
            await fetchBookings();
        } catch (err) {
            setError('Ошибка подтверждения бронирования');
            console.error('Ошибка:', err);
            throw err;
        }
    };

    const cancelBooking = async (id) => {
        try {
            await bookingService.cancelBooking(id);
            await fetchBookings();
        } catch (err) {
            setError('Ошибка отмены бронирования');
            console.error('Ошибка:', err);
            throw err;
        }
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

            const startDate = new Date(startTime);
            const endDate = new Date(endTime);
            
            const newBooking = {
                device_id: deviceIdNumber,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString()
            };
            
            await createBooking(newBooking);
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

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    return {
        bookings: filteredBookings,
        devices,
        loading,
        error,
        selectedDevice,
        filter,
        showForm,
        selectedBooking,
        showModal,
        setFilter,
        setShowForm,
        setSelectedBooking,
        setShowModal,
        handleDeviceChange,
        handleBookingSuccess,
        createBooking,
        updateBooking,
        deleteBooking,
        confirmBooking,
        cancelBooking,
        handleBookingClick,
        refreshBookings: fetchBookings
    };
};

export default useBookings; 