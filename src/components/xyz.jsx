import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Modal,
    TextField,
    Paper,
    Fade,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    IconButton,
    Popover
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
// import Login from '../pages/Login';
import bookMeetingRoomImg from '../assets/damir-kopezhanov-VM1Voswbs0A-unsplash.jpg';
// Add import for logo at the top
import logo from '../assets/BoldTribe Logo-3.png'; // Make sure you have the logo in your assets folder
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const BookMeetingRoom = () => {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
    const [showRoomSelectionModal, setShowRoomSelectionModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingType, setBookingType] = useState('');
    const [memberType, setMemberType] = useState('');
    
    const [selectedSeating, setSelectedSeating] = useState('');
    const [showTimeSlotGridModal, setShowTimeSlotGridModal] = useState(false);
    
    const seatingOptions = [
        { id: 'C1', name: '4-6 Seater', capacity: 4-6 },
        { id: 'C2', name: '10-12 Seater', capacity:10-12}
    ];

    // Modify rooms data to include seating capacity
    const rooms = [
        { id: '307', name: 'Room 307', seating: 'C1' },
        { id: '630', name: 'Room 630', seating: 'C2' },
        { id: '730', name: 'Room 730', seating: 'C1' },
        { id: '420', name: 'Room 420', seating: 'C2' },
        { id: '170', name: 'Room 170', seating: 'C1' }
    ];

    // Mock data for booked rooms (in real app, this would come from backend)
    // Update the bookedRooms state with sample bookings
    const [bookedRooms, setBookedRooms] = useState({
        // Today's bookings
        [`${format(new Date(), 'yyyy-MM-dd')}-09:00`]: ['307', '420'],
        [`${format(new Date(), 'yyyy-MM-dd')}-12:00`]: ['630', '170'],
        [`${format(new Date(), 'yyyy-MM-dd')}-15:00`]: ['730'],

        // Tomorrow's bookings
        [`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}-10:30`]: ['307'],
        [`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}-13:30`]: ['420', '630'],
        [`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}-16:30`]: ['170'],

        // Day after tomorrow's bookings
        [`${format(addDays(new Date(), 2), 'yyyy-MM-dd')}-09:00`]: ['730'],
        [`${format(addDays(new Date(), 2), 'yyyy-MM-dd')}-12:00`]: ['307', '420'],
        [`${format(addDays(new Date(), 2), 'yyyy-MM-dd')}-15:00`]: ['630'],
    });

    // Add this function to calculate duration and price
    const calculateDurationAndPrice = (start, end) => {
        if (!start || !end) return { duration: 0, subtotal: 0, gst: 0, total: 0 };

        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        
        const duration = (endHour + endMinute/60) - (startHour + startMinute/60);
        const basePrice = memberType === 'member' ? 400 : 500;
        const subtotal = Math.ceil(duration * basePrice);
        const gst = subtotal * 0.18;
        
        return {
            duration,
            subtotal,
            gst,
            total: subtotal + gst
        };
    };

    // Update the time slot click handler to include price calculation
    const handleTimeSlotClick = (roomId, startTime, endTime) => {
        if (isRoomAvailable(roomId, selectedDate, startTime, endTime)) {
            setSelectedRoom(roomId);
            setSelectedTime(startTime);
            setSelectedEndTime(endTime);
            const priceDetails = calculateDurationAndPrice(startTime, endTime);
            setCalculatedPrice(priceDetails);
        }
    };

    // Remove this standalone Box component
    // <Box
    //     key={`${startTime}-${endTime}`}
    //     onClick={() => {
    //         if (isRoomAvailable(room.id, selectedDate, startTime)) {
    //             handleTimeSlotClick(room.id, startTime, endTime);
    //         }
    //     }}
    // >
    //     <Typography>
    //         {`${startTime}${parseInt(startTime) < 12 ? 'AM' : 'PM'}-${endTime}${parseInt(endTime) < 12 ? 'AM' : 'PM'}`}
    //         {selectedTime === startTime && (
    //             <Typography
    //                 sx={{
    //                     fontSize: '0.75rem',
    //                     color: '#4CAF50',
    //                     mt: 1
    //                 }}
    //             >
    //                 ₹{calculatedPrice.total.toFixed(2)} (incl. GST)
    //             </Typography>
    //         )}
    //     </Typography>
    // </Box>

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [calculatedPrice, setCalculatedPrice] = useState({ subtotal: 0, gst: 0, total: 0, duration: 0 });

    // Update timeSlots to include 30-minute intervals
    const timeSlots = Array.from({ length: 19 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minutes = (i % 2) * 30;
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return {
            display: `${time}${hour < 12 ? 'AM' : 'PM'}`,
            value: time
        };
    });

    // Get available end times based on start time
    const getEndTimeSlots = (startTime) => {
        if (!startTime) return [];
        const startIndex = timeSlots.findIndex(slot => slot.value === startTime);
        return timeSlots.slice(startIndex + 1);
    };

    // Calculate next 3 days
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    // Update price calculation
    const calculatePrice = (start, end) => {
        if (!start || !end) return 0;
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
        const basePrice = memberType === 'member' ? 400 : 500;
        const subtotal = Math.ceil(duration * basePrice);
        const gst = subtotal * 0.18;
        return {
            subtotal,
            gst,
            total: subtotal + gst,
            duration
        };
    };

    const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleCalendarClick = (event) => {
        setCalendarAnchorEl(event.currentTarget);
    };

    const handleCalendarClose = () => {
        setCalendarAnchorEl(null);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        handleCalendarClose();
    };

    const getDaysInMonth = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        return eachDayOfInterval({ start, end });
    };

    const getAvailableDatesForThreeMonths = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 90; i++) { // 3 months worth of dates
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const ThreeMonthCalendar = () => {
        const months = Array.from({ length: 3 }, (_, i) => {
            const month = new Date(currentMonth);
            month.setMonth(currentMonth.getMonth() + i);
            return month;
        });

        return (
            <Box sx={{ 
                display: 'flex', 
                gap: 4,
                p: 2,
                maxWidth: '1000px',
                overflowX: 'auto'
            }}>
                {months.map((month, idx) => (
                    <Box 
                        key={idx} 
                        sx={{ 
                            bgcolor: 'white', 
                            p: 3, 
                            borderRadius: 2, 
                            boxShadow: 2,
                            width: 280
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                textAlign: 'center', 
                                fontWeight: 'bold',
                                mb: 2,
                                color: '#7B68EE'
                            }}
                        >
                            {format(month, 'MMMM yyyy')}
                        </Typography>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: 1,
                            mb: 1
                        }}>
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <Typography 
                                    key={day} 
                                    sx={{ 
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#7B68EE'
                                    }}
                                >
                                    {day}
                                </Typography>
                            ))}
                        </Box>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: 1
                        }}>
                            {Array.from({ length: startOfMonth(month).getDay() }).map((_, i) => (
                                <Box key={`empty-${i}`} />
                            ))}
                            {getDaysInMonth(month).map((day) => {
                                const isAvailable = getAvailableDatesForThreeMonths().some(d => 
                                    d.getDate() === day.getDate() && 
                                    d.getMonth() === day.getMonth() && 
                                    d.getYear() === day.getYear()
                                );
                                const isSelected = selectedDate && isSameDay(selectedDate, day);

                                return (
                                    <Button
                                        key={day.toISOString()}
                                        onClick={() => isAvailable && handleDateSelect(day)}
                                        sx={{
                                            minWidth: 0,
                                            p: 1,
                                            borderRadius: '50%',
                                            color: isSelected ? 'white' : isAvailable ? 'text.primary' : 'text.disabled',
                                            bgcolor: isSelected ? '#7B68EE' : 'transparent',
                                            '&:hover': {
                                                bgcolor: isAvailable ? 'rgba(123, 104, 238, 0.1)' : 'transparent'
                                            },
                                            cursor: isAvailable ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        {day.getDate()}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>
        );
    };

    // Update room availability check
    const isRoomAvailable = (roomId, date, startTime, endTime) => {
        if (!date || !startTime || !endTime) return true;
        
        // Mock availability check (replace with your backend logic)
        const timeKey = `${format(date, 'yyyy-MM-dd')}-${startTime}-${endTime}`;
        return !bookedRooms[timeKey]?.includes(roomId);
    };

    // Update handleFinalBooking
    // Add this function after the bookedRooms state declaration
    const addNewBooking = (date, startTime, roomId) => {
        const timeKey = `${format(date, 'yyyy-MM-dd')}-${startTime}`;
        setBookedRooms(prevBookings => ({
            ...prevBookings,
            [timeKey]: [...(prevBookings[timeKey] || []), roomId]
        }));
    };

    // Update handleFinalBooking to include the new booking
    const handleFinalBooking = () => {
        if (selectedDate && selectedTime && selectedEndTime && selectedRoom) {
            // Add the new booking
            addNewBooking(selectedDate, selectedTime, selectedRoom);

            const formattedDate = format(selectedDate, "MMM dd, yyyy");
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userName = userData.fullName || 'User';
            const message = encodeURIComponent(
                `Hi, I am ${userName}. I want to book the meeting room ${selectedRoom} as a ${memberType} from ${formattedDate} ${selectedTime} to ${selectedEndTime}. Price: INR ${Math.ceil(calculatedPrice.total)}/- (Including GST)`
            );
            window.location.href = `https://wa.me/+917684836139?text=${message}`;
        }
    };

    const getPricing = () => {
        if (bookingType === 'whole_day') {
            return memberType === 'member' ? 2500 : 3000;
        }
        return memberType === 'member' ? 400 : 500;
    };

    const handleBookNowClick = () => {
        setShowBookingModal(true);
    };

    const handleBookingSubmit = () => {
        if (selectedDate && selectedTime) {
            setShowRoomSelectionModal(true);
        }
    };

    const handleBookingTypeChange = (e) => {
        const newBookingType = e.target.value;
        setBookingType(newBookingType);
        
        // Set member type based on booking type
        if (newBookingType !== 'whole_day') {
            setMemberType(newBookingType);
        } else {
            setMemberType(''); // Reset member type for whole day booking
        }
    };

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',  // Changed from 90vh to 100vh
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',  // Add this to stack items vertically
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 8,
                    pt: 4,
                    pb: 4,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${bookMeetingRoomImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.7)',
                        animation: 'zoomInOut 20s infinite alternate',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '300px',
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.3,
                        animation: 'zoomInOut 20s infinite alternate',
                        zIndex: 1
                    },
                    '@keyframes zoomInOut': {
                        '0%': { transform: 'scale(1)' },
                        '100%': { transform: 'scale(1.1)' },
                    },
                }}
            >
                <Box
                    sx={{
                        mb: 4,
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '-100px',  // Added to adjust logo position
                        '& img': {
                            width: '150px',
                            height: 'auto',
                            animation: 'zoomInOut 20s infinite alternate',
                        },
                        '@keyframes zoomInOut': {
                            '0%': { transform: 'scale(1)' },
                            '100%': { transform: 'scale(1.1)' },
                        },
                    }}
                >
                    <img style={{
                        height: "150px",
                        width: "150px",
                        marginBottom: "-90px"  // Adjusted from 550px
                    }} src={logo} alt="Logo" />
                </Box>

                <Paper
                    elevation={6}
                    sx={{
                        position: 'relative',
                        p: 4,
                        maxWidth: 400,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,255,0.9) 100%)',
                        borderRadius: 2,
                        animation: 'fadeIn 1s ease-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        },
                        position: 'absolute',
                        top: '75%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        marginTop: '4rem',
                        marginBottom: '-8rem',  // Changed from -6rem to -8rem to move it up more
                        zIndex: 2
                    }}
                >
                    {/* Removed the Box with logo here */}
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                            color: '#7B68EE',
                            fontWeight: 'bold',
                            mb: 3
                        }}
                    >
                        Book Meeting Room
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ mb: 4 }}
                    >
                        Book our professional meeting room for your important discussions and presentations.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleBookNowClick}
                        sx={{
                            bgcolor: '#7B68EE',
                            '&:hover': { bgcolor: '#6A5ACD' },
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        }}
                    >
                        Book Now
                    </Button>
                </Paper>
            </Box>

            {/* Booking Type Modal */}
            <Modal open={showBookingModal} onClose={() => setShowBookingModal(false)} closeAfterTransition>
                <Fade in={showBookingModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)'
                    }}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 3,
                                '& img': {
                                    width: '150px',
                                    height: 'auto',
                                    animation: 'zoomInOut 20s infinite alternate',
                                },
                                '@keyframes zoomInOut': {
                                    '0%': { transform: 'scale(1)' },
                                    '100%': { transform: 'scale(1.1)' },
                                },
                            }}
                        >
                            <img src={logo} alt="Logo" />
                        </Box>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Booking Type</InputLabel>
                            <Select
                                value={bookingType}
                                onChange={handleBookingTypeChange}
                                label="Booking Type"
                            >
                                <MenuItem value="member">Members</MenuItem>
                                <MenuItem value="non_member">Non-Members</MenuItem>
                                <MenuItem value="whole_day">Whole Day</MenuItem>
                            </Select>
                        </FormControl>

                        {bookingType === 'whole_day' && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Member Type</InputLabel>
                                <Select
                                    value={memberType}
                                    onChange={(e) => setMemberType(e.target.value)}
                                    label="Member Type"
                                >
                                    <MenuItem value="member">Member</MenuItem>
                                    <MenuItem value="non_member">Non-Member</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {((bookingType && bookingType !== 'whole_day') || (bookingType === 'whole_day' && memberType)) && (
                            <Card sx={{
                                mt: 2,
                                background: 'linear-gradient(135deg, #000000 0%, #00B2B2 100%)',
                                color: 'white',
                                transform: 'scale(1)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <img 
                                            src={logo} 
                                            alt="Logo" 
                                            style={{ 
                                                width: '120px', 
                                                height: 'auto',
                                                marginBottom: '1.5rem',
                                                filter: 'brightness(1.1)'
                                            }} 
                                        />
                                    </Box>
                                    <Typography variant="h5" gutterBottom>
                                        ₹{getPricing()}/- + GST {bookingType === 'whole_day' ? 'per day' : 'per hour'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        09:00 AM to 06:00 PM
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => setShowTimeSlotModal(true)}
                                            sx={{
                                                bgcolor: 'white',
                                                color: '#000000',
                                                px: 4,
                                                py: 1,
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.9)'
                                                }
                                            }}
                                        >
                                            Book Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Fade>
            </Modal>

            {/* Time Slot Selection Modal */}
            <Modal
                open={showTimeSlotModal}
                onClose={() => setShowTimeSlotModal(false)}
                closeAfterTransition
            >
                <Fade in={showTimeSlotModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 1000,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Select Date and Seating Capacity
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                fullWidth
                                value={selectedDate ? format(selectedDate, 'dd MMM yyyy') : ''}
                                label="Selected Date"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <IconButton onClick={handleCalendarClick}>
                                            <CalendarTodayIcon />
                                        </IconButton>
                                    )
                                }}
                            />
                        </Box>

                        <Popover
                            open={Boolean(calendarAnchorEl)}
                            anchorEl={calendarAnchorEl}
                            onClose={handleCalendarClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <ThreeMonthCalendar />
                        </Popover>

                        {selectedDate && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Seating Capacity</InputLabel>
                                <Select
                                    value={selectedSeating}
                                    onChange={(e) => {
                                        setSelectedSeating(e.target.value);
                                        setShowTimeSlotGridModal(true);
                                    }}
                                    label="Seating Capacity"
                                >
                                    {seatingOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                </Fade>
            </Modal>

            {/* Room Selection Modal */}
            <Modal
                open={showRoomSelectionModal}
                onClose={() => setShowRoomSelectionModal(false)}
                closeAfterTransition
            >
                <Fade in={showRoomSelectionModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: 900,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Select Meeting Room
                        </Typography>

                        {/* Date Selection Tabs */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            mb: 4,
                            justifyContent: 'center'
                        }}>
                            {getAvailableDates().map((date) => (
                                <Button
                                    key={format(date, 'yyyy-MM-dd')}
                                    variant={selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') 
                                        ? "contained" 
                                        : "outlined"
                                    }
                                    onClick={() => setSelectedDate(date)}
                                    sx={{
                                        minWidth: 120,
                                        background: selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                                            ? 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)'
                                            : 'transparent'
                                    }}
                                >
                                    {format(date, 'dd MMM yyyy')}
                                </Button>
                            ))}
                        </Box>

                        {/* Room Cards Grid */}
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 6,
                            mb: 3,
                            px: 4,
                            justifyContent: 'space-between'
                        }}>
                            {rooms
                                .filter(room => room.seating === selectedSeating)
                                .map((room) => (
                                    <Card
                                        key={room.id}
                                        onClick={() => {
                                            if (isRoomAvailable(room.id, selectedDate, selectedTime)) {
                                                setSelectedRoom(room.id);
                                            }
                                        }}
                                        sx={{
                                            cursor: 'pointer',
                                            transform: selectedRoom === room.id ? 'scale(1.05)' : 'scale(1)',
                                            transition: 'all 0.3s ease',
                                            bgcolor: isRoomAvailable(room.id, selectedDate, selectedTime)
                                                ? 'white'
                                                : '#ffebee',
                                            border: selectedRoom === room.id ? '2px solid #7B68EE' : 'none',
                                            minWidth: '280px',
                                            textAlign: 'center',
                                            boxShadow: selectedRoom === room.id 
                                                ? '0 8px 16px rgba(123, 104, 238, 0.2)'
                                                : '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 8px 16px rgba(123, 104, 238, 0.2)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography 
                                                variant="h5" 
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#7B68EE',
                                                    mb: 2
                                                }}
                                            >
                                                Room {room.name}
                                            </Typography>
                                            <Typography 
                                                color="textSecondary"
                                                sx={{
                                                    mb: 3,
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {seatingOptions.find(opt => opt.id === room.seating)?.name}
                                            </Typography>
                                            
                                            {/* Time Slots Grid */}
                                            <Box sx={{ 
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: 1,
                                                mt: 2
                                            }}>
                                                {[2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((hours) => {
                                                    const startTime = '09:00';
                                                    const [startHour, startMinute] = startTime.split(':').map(Number);
                                                    const endHour = startHour + Math.floor(hours);
                                                    const endMinute = startMinute + (hours % 1 ? 30 : 0);
                                                    
                                                    const formattedStartTime = `${startHour}:${startMinute.toString().padStart(2, '0')}`;
                                                    const formattedEndTime = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
                                                    
                                                    const isSelected = selectedRoom === room.id && 
                                                                     selectedTime === formattedStartTime && 
                                                                     selectedEndTime === formattedEndTime;
                                                    
                                                    const isAvailable = isRoomAvailable(room.id, selectedDate, formattedStartTime, formattedEndTime);
                                                    
                                                    return (
                                                        <Box
                                                            key={hours}
                                                            onClick={() => {
                                                                if (isAvailable) {
                                                                    handleTimeSlotClick(room.id, formattedStartTime, formattedEndTime);
                                                                }
                                                            }}
                                                            sx={{
                                                                width: '100%',
                                                                aspectRatio: '1',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: isSelected ? '2px solid #4CAF50' : '1px solid #4CAF50',
                                                                borderRadius: '8px',
                                                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                                bgcolor: isSelected 
                                                                    ? 'rgba(76, 175, 80, 0.2)'
                                                                    : isAvailable 
                                                                        ? 'rgba(76, 175, 80, 0.05)'
                                                                        : 'rgba(244, 67, 54, 0.1)',
                                                                '&:hover': isAvailable ? {
                                                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                                    transform: 'scale(1.05)',
                                                                } : {},
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '0.85rem',
                                                                    fontWeight: 'medium',
                                                                    color: isAvailable ? '#4CAF50' : '#f44336',
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                {`${formattedStartTime}${startHour < 12 ? 'AM' : 'PM'}-${formattedEndTime}${endHour < 12 ? 'AM' : 'PM'}`}
                                                            </Typography>
                                                            {isSelected && (
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: '0.75rem',
                                                                        color: '#4CAF50',
                                                                        mt: 1
                                                                    }}
                                                                >
                                                                    ₹{calculatedPrice.total.toFixed(2)}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                            
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: isRoomAvailable(room.id, selectedDate, selectedTime)
                                                        ? 'success.main'
                                                        : 'error.main',
                                                    mt: 3,
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: isRoomAvailable(room.id, selectedDate, selectedTime)
                                                        ? 'rgba(76, 175, 80, 0.1)'
                                                        : 'rgba(244, 67, 54, 0.1)'
                                                }}
                                            >
                                                {isRoomAvailable(room.id, selectedDate, selectedTime)
                                                    ? 'Available'
                                                    : 'Booked'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setShowRoomSelectionModal(false);
                                    setShowTimeSlotModal(true);
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleFinalBooking}
                                disabled={!selectedRoom}
                                sx={{
                                    background: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #6A5ACD 0%, #5B4ACE 100%)'
                                    }
                                }}
                            >
                                Confirm Booking
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* <Login
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={() => {
                    setShowLoginModal(false);
                    setShowBookingModal(true);
                }}
            /> */}
        </>
    );
};

export default BookMeetingRoom;

// Add this before the return statement
    const TimeSlotGrid = () => {
        const availableRooms = rooms.filter(room => room.seating === selectedSeating);
        
        const timeSlotStatus = (time) => {
            const timeKey = `${format(selectedDate, 'yyyy-MM-dd')}-${time}`;
            const bookedRoomsForSlot = bookedRooms[timeKey] || [];
            const isAvailable = availableRooms.some(room => !bookedRoomsForSlot.includes(room.id));
            return isAvailable;
        };

        return (
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>
                    Available Time Slots
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Date: {format(selectedDate, 'dd MMM yyyy')}
                    <br />
                    Seating: {seatingOptions.find(opt => opt.id === selectedSeating)?.name}
                </Typography>
                
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 2,
                    mb: 3
                }}>
                    {timeSlots.map((slot) => (
                        <Button
                            key={slot.value}
                            variant="contained"
                            onClick={() => {
                                if (timeSlotStatus(slot.value)) {
                                    setSelectedTime(slot.value);
                                    setShowTimeSlotGridModal(false);
                                } else {
                                    alert('This time slot is not available. Please select another.');
                                }
                            }}
                            sx={{
                                bgcolor: timeSlotStatus(slot.value) ? '#4CAF50' : '#FF0000',
                                '&:hover': {
                                    bgcolor: timeSlotStatus(slot.value) ? '#45a049' : '#cc0000'
                                },
                                color: 'white',
                                p: 2
                            }}
                        >
                            {slot.display}
                        </Button>
                    ))}
                </Box>
            </Box>
        );
    };