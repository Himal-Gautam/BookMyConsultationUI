import {
    Button,
    Card,
    CardHeader,
    CardContent,
    TextField,
    Typography,
    FormHelperText
} from '@material-ui/core';
import { Rating } from "@material-ui/lab";
import Modal from "react-modal/lib/components/Modal";
import { customModalStyles } from '../../common/header/Header';
import '../../common/header/Header.css';
import { useContext, useEffect, useState } from 'react';
import { SnackbarContext, UserContext } from "../Controller";
import { fetchData } from '../../util/fetch';

const RateAppointment = ({ showRateAppointmentModal = false, setShowRateAppointmentModal, appointment }) => {
    const { loggedInUser } = useContext(UserContext);
    const { OpenGenericSnackBar } = useContext(SnackbarContext);
    const [rateAppointmentData, setRateAppointmentData] = useState({});
    useEffect(() => {
        if (appointment !== null && appointment !== undefined) {
            setRateAppointmentData({
                "appointmentId": appointment.appointmentId,
                "doctorId": appointment.doctorId,
                "rating": "0"
            });
        }
    }, [appointment]);
    const [ratingError, setRatingError] = useState(false);
    const handleChange = (event) => {
        setRateAppointmentData({ ...rateAppointmentData, [event.target.name]: event.target.value });
        if (event.target.name === 'rating') {
            setRatingError(event.target.value === '0');
        }
    }
    const rateAppointment = async () => {
        if (rateAppointmentData.rating === '0') {
            setRatingError(true);
            return;
        }
        const [, hasError] = await fetchData('ratings',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + loggedInUser.accessToken,
                },
                body: JSON.stringify(rateAppointmentData),
            },
            OpenGenericSnackBar
        );
        if (!hasError) {
            setShowRateAppointmentModal(false);
        }
    }

    const modalStyle = { content: { ...customModalStyles.content, width: '50%' } }

    return (
        <Modal
            isOpen={showRateAppointmentModal}
            onRequestClose={() => setShowRateAppointmentModal(false)}
            style={modalStyle}
            contentLabel="Rate an Appointment"
        >
            <Card>
                <CardHeader className="modal-header" title="Rate an Appointment" />
                <CardContent className='rate-appointment-form'>
                    <div>
                        <TextField
                            multiline
                            minRows={4}
                            value={rateAppointmentData?.comments}
                            variant="standard"
                            name='comments'
                            label='Comments'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Typography component="span">Rating:</Typography>
                        <Rating
                            name="rating"
                            value={rateAppointmentData.rating}
                            onChange={handleChange}
                            precision={0.5}
                        />
                        {ratingError && <FormHelperText style={{ color: 'red' }}>Submit a rating</FormHelperText>}
                    </div>
                    <Button variant="contained" color='primary' className='book-appointment-btn' onClick={rateAppointment}>RATE APPOINTMENT</Button>
                </CardContent>
            </Card>
        </Modal>
    );
}

export default RateAppointment;