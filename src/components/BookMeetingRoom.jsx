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
    Popover,
    Checkbox,
    FormControlLabel,
    Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays, addMonths, endOfMonth } from 'date-fns';
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
        // [`${format(new Date(), 'yyyy-MM-dd')}-09:00`]: ['307', '420'],
        // [`${format(new Date(), 'yyyy-MM-dd')}-12:00`]: ['630', '170'],
        // [`${format(new Date(), 'yyyy-MM-dd')}-15:00`]: ['730'],

        // Tomorrow's bookings
        [`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}-10:30`]: ['307'],
        [`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}-13:30`]: ['420', '630'],
        [`${format(addDays(new Date(), 1), 'yyyy-MM-dd')}-16:30`]: ['170'],

        // Day after tomorrow's bookings
        [`${format(addDays(new Date(), 2), 'yyyy-MM-dd')}-09:00`]: ['730'],
        [`${format(addDays(new Date(), 2), 'yyyy-MM-dd')}-12:00`]: ['307', '420'],
        [`${format(addDays(new Date(), 2), 'yyyy-MM-dd')}-15:00`]: ['630'],
    });

    // Add this function to calculate duration and price based on seating capacity
    const calculateDurationAndPrice = (start, end) => {
        if (!start || !end) return { duration: 0, subtotal: 0, gst: 0, total: 0 };

        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        
        const duration = (endHour + endMinute/60) - (startHour + startMinute/60);
        
        // Use the getBasePrice function for consistent pricing
        const basePrice = getBasePrice();
        
        const subtotal = Math.ceil(duration * basePrice);
        // const gst = subtotal * 0.18;
        
        return {
            duration,
            subtotal,
            // gst,
            total: subtotal
        };
    };

    // Update time slot selection handler for multiple slots with limits based on member type
    const handleTimeSlotSelection = (slot) => {
        if (isRoomAvailable('time1', selectedDate, slot.start, slot.end)) {
            // Check if this slot is already selected
            const slotIndex = selectedTimeSlots.findIndex(
                s => s.start === slot.start && s.end === slot.end
            );
            
            let newSelectedSlots;
            if (slotIndex >= 0) {
                // If slot is already selected, remove it
                newSelectedSlots = selectedTimeSlots.filter((_, index) => index !== slotIndex);
            } else {
                // Check if adding this slot would exceed the maximum allowed slots
                const maxSlots = memberType === 'member' ? 3 : 4; // Max 3 slots for members, 4 for non-members
                
                if (selectedTimeSlots.length >= maxSlots) {
                    // Maximum slots already selected, don't add more
                    return;
                }
                
                // If slot is not selected and under the limit, add it
                newSelectedSlots = [...selectedTimeSlots, slot];
            }
            
            setSelectedTimeSlots(newSelectedSlots);
            
            // Calculate total price for all selected slots
            const totalPriceDetails = calculateTotalPrice(newSelectedSlots);
            setCalculatedPrice(totalPriceDetails);
            
            // Set the first selected slot's time as the main selected time (for backward compatibility)
            if (newSelectedSlots.length > 0) {
                setSelectedTime(newSelectedSlots[0].start);
                setSelectedEndTime(newSelectedSlots[0].end);
            } else {
                setSelectedTime('');
                setSelectedEndTime('');
            }
        }
    };
    
    // Get maximum allowed time slots based on member type
    const getMaxAllowedSlots = () => {
        return memberType === 'member' ? 3 : 4; // Max 3 slots for members, 4 for non-members
    };
    
    // Get remaining available slots
    const getRemainingSlots = () => {
        const maxSlots = getMaxAllowedSlots();
        return maxSlots - selectedTimeSlots.length;
    };
    
    // Calculate total price for all selected time slots
    const calculateTotalPrice = (slots) => {
        if (!slots || slots.length === 0) {
            return { duration: 0, subtotal: 0, gst: 0, total: 0 };
        }
        
        const totalDetails = slots.reduce((acc, slot) => {
            const slotDetails = calculateDurationAndPrice(slot.start, slot.end);
            return {
                duration: acc.duration + slotDetails.duration,
                subtotal: acc.subtotal + slotDetails.subtotal,
                gst: acc.gst + slotDetails.gst,
                total: acc.total + slotDetails.total
            };
        }, { duration: 0, subtotal: 0, gst: 0, total: 0 });
        
        return totalDetails;
    };

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [calculatedPrice, setCalculatedPrice] = useState({ subtotal: 0, gst: 0, total: 0, duration: 0 });
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

    // Update timeSlots to include 30-minute and 1-hour intervals
    const timeSlots = Array.from({ length: 19 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minutes = (i % 2) * 30;
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return {
            display: `${time}${hour < 12 ? 'AM' : 'PM'}`,
            value: time
        };
    });

    // Get available time slots for members
    const getMemberTimeSlots = () => {
        const slots = [];
        for (let i = 0; i < timeSlots.length - 1; i++) {
            const startTime = timeSlots[i].value;
            const endTime30 = timeSlots[i + 1].value;
            const endTime60 = i < timeSlots.length - 2 ? timeSlots[i + 2].value : null;
            
            slots.push({
                start: startTime,
                end: endTime30,
                duration: '30 minutes',
                display: `${timeSlots[i].display} - ${timeSlots[i + 1].display}`
            });

            if (endTime60) {
                slots.push({
                    start: startTime,
                    end: endTime60,
                    duration: '1 hour',
                    display: `${timeSlots[i].display} - ${timeSlots[i + 2].display}`
                });
            }
        }
        return slots;
    };

    // Calculate next 3 days from selected date
    const getAvailableDates = () => {
        const dates = [];
        if (selectedDate) {
            for (let i = 0; i < 3; i++) {
                const date = new Date(selectedDate);
                date.setDate(selectedDate.getDate() + i);
                dates.push(date);
            }
        }
        return dates;
    };

    // Update price calculation based on seating capacity
    const calculatePrice = (start, end) => {
        if (!start || !end) return 0;
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
        
        // Use the getBasePrice function for consistent pricing
        const basePrice = getBasePrice();
        
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

    // Calculate min and max dates
    const minDate = new Date(); // Current date
    const maxDate = endOfMonth(addMonths(new Date(), 2)); // End of the month after next

    // Update time slot selection modal content
     const TimeSlotContent = () => (
        <>
            <Typography variant="h6" gutterBottom>
                Select Date and Seating Capacity
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setSelectedSeating('');
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </LocalizationProvider>
            
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
        </>
    )
    

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

    // Update handleFinalBooking to include multiple bookings
    const handleFinalBooking = () => {
        if (selectedDate && selectedTimeSlots.length > 0 && selectedRoom) {
            // Add all selected bookings
            selectedTimeSlots.forEach(slot => {
                addNewBooking(selectedDate, slot.start, selectedRoom);
            });

            const formattedDate = format(selectedDate, "MMM dd, yyyy");
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userName = userData.fullName || 'User';
            
            // Create a formatted message with all selected time slots
            let timeSlotText;
            let priceText;
            
            if (bookingType === 'whole_day') {
                timeSlotText = "Whole Day (09:00 to 18:00)";
                priceText = `INR ${memberType === 'member' ? '1800' : '2300'}/- (Including GST)`;
            } else {
                timeSlotText = selectedTimeSlots.map(slot => 
                    `${slot.start} to ${slot.end}`
                ).join(', ');
                priceText = `INR ${Math.ceil(calculatedPrice.total)}/- (Including GST)`;
            }
            
            const message = encodeURIComponent(
                `Hi, I am ${userName}. I want to book the meeting room ${selectedRoom} as a ${memberType} on ${formattedDate} for the following time slots: ${timeSlotText}. Price: ${priceText}`
            );
            window.location.href = `https://wa.me/+917684836139?text=${message}`;
        }
    };

    // Get base price based on member type and seating capacity
    const getBasePrice = () => {
        // For whole day booking
        if (bookingType === 'whole_day') {
            if (selectedSeating === 'C2') { // 10-12 Seater
                return memberType === 'member' ? 2500 : 3000;
            }
            return memberType === 'member' ? 1800 : 2300; // Default whole day pricing for 4-6 seater
        }
        
        // For hourly booking
        if (memberType === 'member') {
            // For members, price depends on seating capacity
            if (selectedSeating === 'C1') { // 4-6 Seater
                return 200;
            } else if (selectedSeating === 'C2') { // 10-12 Seater
                return 400;
            } else {
                return 400; // Default member price if no seating selected
            }
        }
        
        // For non-members, price depends on seating capacity
        if (memberType === 'non_member') {
            if (selectedSeating === 'C1') { // 4-6 Seater
                return 250;
            } else if (selectedSeating === 'C2') { // 10-12 Seater
                return 500;
            }
        }
        
        // Default for non-members if no seating selected
        return 500;
    };
    
    const getPricing = () => {
        return getBasePrice();
    };

    const handleBookNowClick = () => {
        setShowBookingModal(true);
    };

    const handleBookingSubmit = () => {
        // console.log("Selected Date:", selectedDate);
        if (selectedDate) {
            // For whole day booking, set the calculated price directly
            if (bookingType === 'whole_day') {
                const basePrice = getBasePrice();
                setCalculatedPrice({
                    duration: 9, // 9 hours (9am-6pm)
                    subtotal: basePrice,
                    gst: 0, // GST is already included
                    total: basePrice
                });
                
                // For whole day booking, create a single time slot for the whole day
                setSelectedTimeSlots([{
                    start: '09:00',
                    end: '18:00',
                    duration: 'Whole Day',
                    display: '09:00AM - 06:00PM'
                }]);
            }
            
            setShowRoomSelectionModal(true);
            setShowTimeSlotModal(false);
        }
    };

    const handleBookingTypeChange = (e) => {
        const newBookingType = e.target.value;
        setBookingType(newBookingType);
        
        // // Set member type based on booking type
        // if (newBookingType !== 'whole_day') {
            // setMemberType(newBookingType);
            
        //     // For non-members, automatically generate 1-hour time slots
        //     if (newBookingType === 'non_member') {
                // setSelectedDuration('1hour');
                //  setAvailableTimeSlots(generateTimeSlots('1hour'));
        //     }
        // } else {
        //     // For whole day booking, reset time slots and show member type selection
        //     setSelectedTimeSlots([]);
        //     setAvailableTimeSlots([]);
        // }
        setSelectedTimeSlots([]);
        setAvailableTimeSlots([]);
    };

    const [amenities, setAmenities] = useState({
        tea: false,
        coffee: false,
        cookies: false
    });

    const amenitiesPrices = {
        tea:0 ,
        coffee:0 ,
        cookies: 0
    };

    const calculateAmenitiesTotal = () => {
        return Object.entries(amenities).reduce((total, [item, selected]) => {
            return selected ? total + amenitiesPrices[item] : total;
        }, 0);
    };

    const handleAmenityChange = (event) => {
        setAmenities({
            ...amenities,
            [event.target.name]: event.target.checked
        });
    };

    const [selectedDuration, setSelectedDuration] = useState('30min');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

    // Function to generate time slots based on selected duration and member type
    const generateTimeSlots = (duration, memberType = null) => {
        const slots = [];
        const startHour = 9;
        const endHour = 18;
        const endMinute = 30; 
       console.log("memberType",memberType);
       console.log("duration",duration);
        // For members, show 30-minute and 1-hour slots between 9am-6pm
        // if (memberType === 'member') {
            
        // }
        // For non-members, only show 1-hour slots between 9am-6pm
        if (memberType === 'non_member') {
            for (let hour = startHour; hour < endHour; hour++) {
                const startTime = `${hour.toString().padStart(2, '0')}:00`;
                const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                
                const formattedStartTime = `${startTime}${hour < 12 ? 'AM' : 'PM'}`;
                const formattedEndTime = `${endTime}${(hour + 1) < 12 ? 'AM' : 'PM'}`;
                
                slots.push({
                    start: startTime,
                    end: endTime,
                    duration: '1 hour',
                    display: `${formattedStartTime} - ${formattedEndTime}`
                });
            }
            return slots;
        }

        // For members, show both 30-min and 1-hour options
        if (duration === '30min') {
            for (let hour = startHour; hour <= endHour; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    if (hour === endHour && minute > endMinute) break;
                    
                    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const endTime = minute === 30 
                        ? `${(hour + 1).toString().padStart(2, '0')}:00`
                        : `${hour.toString().padStart(2, '0')}:30`;
                    
                    const formattedStartTime = `${startTime}${hour < 12 ? 'AM' : 'PM'}`;
                    const formattedEndHour = minute === 30 ? hour + 1 : hour;
                    const formattedEndTime = `${endTime}${formattedEndHour < 12 ? 'AM' : 'PM'}`;
                    
                    slots.push({
                        start: startTime,
                        end: endTime,
                        duration: '30 minutes',
                        display: `${formattedStartTime} - ${formattedEndTime}`
                    });
                }
            }
        } else if (duration === '1hour') {
            for (let hour = startHour; hour < endHour; hour++) {
                const startTime = `${hour.toString().padStart(2, '0')}:00`;
                const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                
                const formattedStartTime = `${startTime}${hour < 12 ? 'AM' : 'PM'}`;
                const formattedEndTime = `${endTime}${(hour + 1) < 12 ? 'AM' : 'PM'}`;
                
                slots.push({
                    start: startTime,
                    end: endTime,
                    duration: '1 hour',
                    display: `${formattedStartTime} - ${formattedEndTime}`
                });
            }
        }

        return slots;
    };
const handleHourlyMemberType = (memberType) => {
     
    if (memberType === 'member') {
        setMemberType('member'); // we need to check why this state not updating on time
        setSelectedDuration('30min');
        setAvailableTimeSlots(generateTimeSlots('30min', 'member'));


    } else {
        setMemberType('non_member');
        setSelectedDuration('1hour');
        setAvailableTimeSlots(generateTimeSlots('1hour', 'non_member'));
    }
};
    // Update handleTimeChange
    const handleTimeChange = (event) => {
        const time = event.target.value;
        setSelectedTime(time);
        setSelectedEndTime('');
        setSelectedTimeSlots([]);
        setCalculatedPrice({ subtotal: 0, gst: 0, total: 0, duration: 0 });
    };

    // Update handleDurationChange
    const handleDurationChange = (event) => {
        const duration = event.target.value;
        setSelectedDuration(duration);
        //  setAvailableTimeSlots(generateTimeSlots(duration));
        setAvailableTimeSlots(generateTimeSlots(duration,memberType));
        setSelectedTime('');
        setSelectedEndTime('');
        setSelectedTimeSlots([]);
        setCalculatedPrice({ subtotal: 0, gst: 0, total: 0, duration: 0 });
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
                                {/* <MenuItem value="member">Members</MenuItem>
                                <MenuItem value="non_member">Non-Members</MenuItem> */}
                                <MenuItem value="hourly">Hourly</MenuItem>
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
                        {bookingType === 'hourly' && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Member Type</InputLabel>
                                <Select
                                    value={memberType}
                                    onChange={(e) => {handleHourlyMemberType(e.target.value)}}
                                    // onChange ={handleHourlyMemberType}
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
                                        {bookingType === 'whole_day' ? 
                                            `₹${memberType === 'member' ? '1800' : '2300'}/- (Including GST)` : 
                                            `₹${getPricing()}/- + GST per hour`
                                        }
                                    </Typography>
                                    {memberType === 'member' && bookingType !== 'whole_day' && (
                                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                            {selectedSeating === 'C1' ? '4-6 Seater: ₹200/hr' : selectedSeating === 'C2' ? '10-12 Seater: ₹400/hr' : ''}
                                        </Typography>
                                    )}
                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        09:00 AM to 06:30 PM
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
                        width: 400,
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={handleDateSelect}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            label="Selected Date"
                                            InputProps={{
                                                ...params.InputProps,
                                                readOnly: true,
                                                endAdornment: (
                                                    <IconButton onClick={handleCalendarClick}>
                                                        <CalendarTodayIcon />
                                                    </IconButton>
                                                )
                                            }}
                                        />
                                    )}
                                    PopperProps={{
                                        anchorEl: calendarAnchorEl,
                                        open: Boolean(calendarAnchorEl),
                                        onClose: handleCalendarClose,
                                    }}
                                    components={{
                                        OpenPickerIcon: () => null,
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        {selectedDate && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Seating Capacity</InputLabel>
                                <Select
                                    value={selectedSeating}
                                    onChange={(e) => setSelectedSeating(e.target.value)}
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

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleBookingSubmit}
                            disabled={!selectedDate || !selectedSeating}
                            sx={{
                                background: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6A5ACD 0%, #5B4ACE 100%)'
                                }
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </Fade>
            </Modal>

            {/* Time Slots Modal */}
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
                            Select Time Slot
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

                        {memberType === 'member' || memberType === 'non_member' ? (
                            <>
                                {memberType === 'member'  && (
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel>Duration</InputLabel>
                                        <Select
                                            value={selectedDuration}
                                            onChange={handleDurationChange}
                                            label="Duration"
                                        >
                                            <MenuItem value="30min">30 Minutes</MenuItem>
                                            <MenuItem value="1hour">1 Hour</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}

                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#7B68EE' }}>
                                    You can select up to {getMaxAllowedSlots()} time slots ({getRemainingSlots()} remaining)
                                </Typography>
                                <Box sx={{ 
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 2,
                                    mb: 3,
                                    px: 4
                                }}>
                                    {availableTimeSlots.map((slot) => {
                                        const isAvailable = isRoomAvailable('time1', selectedDate, slot.start, slot.end);
                                        const isSelected = selectedTimeSlots.some(s => s.start === slot.start && s.end === slot.end);
                                        
                                        return (
                                            <Box
                                                key={`${slot.start}-${slot.end}`}
                                                onClick={() => {
                                                    if (isAvailable && (selectedTimeSlots.some(s => s.start === slot.start && s.end === slot.end) || selectedTimeSlots.length < getMaxAllowedSlots())) {
                                                        handleTimeSlotSelection(slot);
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
                                                    cursor: isAvailable && (isSelected || selectedTimeSlots.length < getMaxAllowedSlots()) ? 'pointer' : 'not-allowed',
                                                    bgcolor: isSelected 
                                                        ? 'rgba(76, 175, 80, 0.2)'
                                                        : !isAvailable 
                                                            ? 'rgba(244, 67, 54, 0.1)'
                                                            : selectedTimeSlots.length >= getMaxAllowedSlots() && !isSelected
                                                                ? 'rgba(255, 152, 0, 0.1)' // Orange/amber for max slots reached
                                                                : 'rgba(76, 175, 80, 0.05)',
                                                    '&:hover': isAvailable && (isSelected || selectedTimeSlots.length < getMaxAllowedSlots()) ? {
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
                                                    {slot.display}
                                                </Typography>
                                                {isSelected && (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            color: '#4CAF50',
                                                            mt: 1
                                                        }}
                                                    >
                                                        Selected
                                                    </Typography>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>
                                
                                {selectedTimeSlots.length > 0 && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5ff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Selected Time Slots: ({selectedTimeSlots.length}/{getMaxAllowedSlots()})
                                        </Typography>
                                        {selectedTimeSlots.map((slot, index) => (
                                            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                                {slot.display} ({slot.duration})
                                            </Typography>
                                        ))}
                                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                            Total Price: ₹{Math.ceil(calculatedPrice.total)}/- (Including GST)
                                        </Typography>
                                        {selectedTimeSlots.length >= getMaxAllowedSlots() && (
                                            <Typography variant="body2" sx={{ mt: 1, color: 'warning.main', fontWeight: 'medium' }}>
                                                You've reached the maximum number of slots allowed for {memberType === 'member' ? 'members' : 'non-members'}.
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </>
                        ) : (
                            // Fixed timing display for whole day
                            <Box sx={{ 
                                textAlign: 'center',
                                mb: 4,
                                p: 3,
                                bgcolor: 'rgba(123, 104, 238, 0.1)',
                                borderRadius: 2
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Fixed Timing
                                </Typography>
                                <Typography variant="h5" color="primary">
                                    {bookingType === 'whole_day' && memberType === 'member' 
                                        ? '09:00 AM - 06:30 PM' 
                                        : '09:00 AM - 06:00 PM'}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    Seating Capacity: {seatingOptions.find(opt => opt.id === selectedSeating)?.name}
                                </Typography>
                            </Box>
                        )}

                        {/* Amenities Section */}
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>
                            Amenities
                        </Typography>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 2,
                            mb: 3,
                            px: 4
                        }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={amenities.tea}
                                        onChange={handleAmenityChange}
                                        name="tea"
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography>Tea</Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={amenities.coffee}
                                        onChange={handleAmenityChange}
                                        name="coffee"
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography>Coffee</Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={amenities.cookies}
                                        onChange={handleAmenityChange}
                                        name="cookies"
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography>Cookies</Typography>
                                    </Box>
                                }
                            />
                        </Box>

                        {/* Total Price with Amenities */}
                        {(bookingType === 'non_member' || bookingType === 'whole_day') && (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2,
                                p: 2,
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                borderRadius: 1
                            }}>
                                <Typography variant="h6">
                                    Total Price (Including Amenities)
                                </Typography>
                                <Typography variant="h6" color="success.main">
                                    ₹{(calculatedPrice.total + calculateAmenitiesTotal()).toFixed(2)}
                                </Typography>
                            </Box>
                        )}

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
                                disabled={!selectedDate || (bookingType === 'member' && !selectedTime)}
                                sx={{
                                    background: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #6A5ACD 0%, #5B4ACE 100%)'
                                    }
                                }}
                            >
                                {bookingType === 'member' ? 'Confirm Booking' : 'Proceed to Payment'}
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
export { TimeSlotGrid };
 
export default BookMeetingRoom;
    
