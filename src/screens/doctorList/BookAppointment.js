import {
    Button,
    Card,
    CardHeader,
    CardContent,
    TextField,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography
} from '@material-ui/core';
import { Language } from '@material-ui/icons';
import Modal from "react-modal/lib/components/Modal";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { customModalStyles } from '../../common/header/Header';
import '../../common/header/Header.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Controller';
import { fetchData } from '../../util/fetch';

const TIME_SLOTS = [
    "09AM-10AM",
    "10AM-11AM",
    "11AM-12PM",
    "12PM-01PM",
    "01PM-02PM",
    "02PM-03PM",
    "03PM-04PM",
    "04PM-05PM",
    "05PM-06PM",
    "06PM-07PM",
    "07PM-08PM",
    "08PM-09PM",
    "09PM-10PM",
    "10PM-11PM"
];

const BookAppointment = ({ showBookAppointmentModal = false, setShowBookAppointmentModal, doctor }) => {
    const { loggedInUser } = useContext(UserContext);
    const [[showReponseError, message], setShowResponseError] = useState([false, '']);

    const handleResponseErrorClose = () => {
        setShowResponseError([false, '']);
    }

    const OpenGenericSnackBar = (showError, message) => {
        if (message === 'This slot is unavailable') {
            message = 'Either the slot is already booked or not available';
        }
        setShowResponseError([showError, message]);
    }

    const handleClose = () => {
        setShowBookAppointmentModal(false);
    };

    const [bookAppointmentData, setBookAppointmentData] = useState({});

    useEffect(() => {
        if (loggedInUser !== null && loggedInUser !== undefined && doctor !== null && doctor !== undefined) {
            setBookAppointmentData({
                "doctorId": doctor.id,
                "doctorName": doctor.firstName + ' ' + doctor.lastName,
                "userId": loggedInUser.id,
                "userName": loggedInUser.firstName,
                "userEmailId": loggedInUser.emailAddress,
                "timeSlot": 'None',
                "appointmentDate": new Date().toISOString().split('T')[0],
                "createdDate": "",
            });
        }
    }, [doctor, loggedInUser]);

    const handleChange = (event) => {
        setBookAppointmentData({ ...bookAppointmentData, [event.target.name]: event.target.value });
        if (event.target.name === 'timeSlot') {
            setTimeSlotError(event.target.value === 'None');
        }
    }

    const handleDateChange = (date) => {
        setBookAppointmentData({ ...bookAppointmentData, 'appointmentDate': date.toISOString().split('T')[0] });
    }

    const modalStyle = { content: { ...customModalStyles.content, width: '50%' } }

    const [timeSlotError, setTimeSlotError] = useState(false);

    const bookAppointment = async () => {
        if (bookAppointmentData.timeSlot === 'None') {
            setTimeSlotError(true);
        } else {
            const [, hasError] = await fetchData('appointments',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + loggedInUser.accessToken,
                    },
                    body: JSON.stringify(bookAppointmentData),
                },
                OpenGenericSnackBar
            );
            if (!hasError) {
                setShowBookAppointmentModal(false);
            }
        }
    }

    return (
        <>
            <Modal
                isOpen={showBookAppointmentModal}
                onRequestClose={handleClose}
                style={modalStyle}
                contentLabel="Book an Appointment"
            >
                <Card>
                    <CardHeader className="modal-header" title="Book an Appointment" />
                    <CardContent className='book-appointment-form'>
                        <div>
                            <TextField label="DoctorName" value={bookAppointmentData.doctorName} disabled required />
                        </div>
                        <div>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={bookAppointmentData.appointmentDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div>
                            <FormControl className='select-width'>
                                <InputLabel>Timeslot</InputLabel>
                                <Select name='timeSlot' value={bookAppointmentData.timeSlot} onChange={handleChange}>
                                    <MenuItem key='None' value='None'>None</MenuItem>
                                    {TIME_SLOTS.map((slot) => (
                                        <MenuItem key={slot} value={slot}>
                                            {slot}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {timeSlotError && <FormHelperText style={{ color: 'red' }}>Select a time slot</FormHelperText>}
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                multiline
                                minRows={4}
                                value={bookAppointmentData?.priorMedicalHistory}
                                variant="standard"
                                name='priorMedicalHistory'
                                label='Medical History'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                multiline
                                minRows={4}
                                value={bookAppointmentData?.symptoms}
                                variant="standard"
                                name='symptoms'
                                label='Symptoms'
                                placeholder="ex:Cold, Swelling, etc"
                                onChange={handleChange}
                            />
                        </div>
                        <Button variant="contained" color='primary' className='book-appointment-btn' onClick={bookAppointment}>BOOK APPOINTMENT</Button>
                    </CardContent>
                </Card>
            </Modal>
            <Dialog
                open={showReponseError}
                onClose={handleResponseErrorClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle disableTypography>
                    <Typography component="h2" className="icon-header">
                        <Language />
                        {window.location.host}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={handleResponseErrorClose} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookAppointment;