import { useContext, useEffect, useState } from "react";
import { fetchData } from "../../util/fetch";
import { SnackbarContext, UserContext } from "../Controller";
import { Button, Paper, Typography } from '@material-ui/core';
import RateAppointment from "./RateAppointment";
import "./Appointment.css";

const Appointment = () => {
    const { loggedInUser } = useContext(UserContext);
    const { OpenGenericSnackBar } = useContext(SnackbarContext);
    const [appointmentsList, setAppointmentsList] = useState([]);
    const [showRateAppointmentModal, setShowRateAppointmentModal] = useState(false);
    const [appointment, setAppointment] = useState({});
    useEffect(() => {
        const fetchDetails = async () => {
            if (loggedInUser !== null && loggedInUser !== undefined) {
                const [appointmentsResponse, hasError] = await fetchData(
                    'users/' + loggedInUser.id + '/appointments',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + loggedInUser.accessToken
                        }
                    },
                    OpenGenericSnackBar
                );
                if (!hasError) {
                    setAppointmentsList(JSON.parse(appointmentsResponse));
                }
            }
        }
        fetchDetails();
    }, [OpenGenericSnackBar, loggedInUser]);
    return (
        <div>
            {(loggedInUser === null || loggedInUser === undefined) ?
                <p className="body-text">Login to see appointments</p>
                :
                <>
                    <div className="app-appointment-list">
                        {appointmentsList.map((appointment) => (
                            <Paper key={'appointment-' + appointment.id} className='app-card'>
                                <Typography variant="h6">Dr: {appointment.doctorName}</Typography>
                                <Typography variant="h6">Date: {appointment.appointmentDate}</Typography>
                                <Typography variant="h6">Symptoms: {appointment?.symptoms}</Typography>
                                <Typography variant="h6" className="lrg-txt">priorMedicalHistory: {appointment?.priorMedicalHistory}</Typography>
                                <Button variant="contained" color="primary"
                                    onClick={() => {
                                        setShowRateAppointmentModal(true);
                                        setAppointment(appointment);
                                    }}
                                >
                                    RATE APPOINTMENT
                                </Button>
                            </Paper>
                        ))}
                    </div>
                    <RateAppointment
                        showRateAppointmentModal={showRateAppointmentModal}
                        setShowRateAppointmentModal={setShowRateAppointmentModal}
                        appointment={appointment}
                    ></RateAppointment>
                </>
            }
        </div>
    );
}

export default Appointment;
