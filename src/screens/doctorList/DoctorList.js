import './DoctorList.css';
import { useContext, useEffect, useState } from "react";
import { fetchData } from "../../util/fetch";
import { SnackbarContext, UserContext } from "../Controller";
import { Button, Paper, Typography, TextField, MenuItem } from '@material-ui/core';
import { Rating } from "@material-ui/lab";
import BookAppointment from './BookAppointment';
import DoctorDetails from './DoctorDetails';

const DoctorList = () => {
    const { OpenGenericSnackBar } = useContext(SnackbarContext);
    const [doctorsList, setDoctorsList] = useState([]);
    const [specialityList, setspecialityList] = useState([]);
    const [speciality, setSpeciality] = useState('');
    const { loggedInUser } = useContext(UserContext);
    const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
    const [showDoctorDetails, setshowDoctorDetails] = useState(false);
    const [doctor, setDoctor] = useState({});
    useEffect(() => {
        const fetchDetails = async () => {
            const [specialities, hasSpecialityError] = await fetchData('doctors/speciality', { method: 'GET' }, OpenGenericSnackBar);
            if (!hasSpecialityError) {
                setspecialityList(JSON.parse(specialities));
            }
        }
        fetchDetails();
    }, [OpenGenericSnackBar]);

    useEffect(() => {
        const fetchDetails = async () => {
            const url = 'doctors' + (speciality === '' ? '' : '?speciality=' + speciality)
            const [doctors, hasDoctorError] = await fetchData(url, { method: 'GET' }, OpenGenericSnackBar);
            if (!hasDoctorError) {
                setDoctorsList(JSON.parse(doctors));
            }
        }
        fetchDetails();
    }, [OpenGenericSnackBar, speciality]);

    return (
        <>
            <div className="app-doctors-list">
                <form className='app-filter-block' noValidate autoComplete='off'>
                    <Typography variant="h6">Select Speciality:</Typography>
                    <TextField
                        className='app-filter'
                        select
                        label="Select"
                        value={speciality}
                        helperText=""
                        variant="filled"
                        onChange={(event) => {
                            setSpeciality(event.target.value);
                        }}
                    >
                        {specialityList.map((speciality) => (
                            <MenuItem key={speciality} value={speciality}>
                                {speciality}
                            </MenuItem>
                        ))}
                    </TextField>
                </form>
                {doctorsList.map((doctor) => (
                    <Paper key={'doctor-' + doctor.id} className='doc-card'>
                        <Typography variant="h6">Doctor Name: {doctor.firstName + " " + doctor.lastName}</Typography>
                        <br></br>
                        <Typography variant="h6">Speciality: {doctor.speciality}</Typography>
                        <Typography variant="h6">Rating:
                            <Rating
                                name="simple-controlled"
                                value={doctor.rating}
                                precision={0.5}
                                readOnly
                            />
                        </Typography>
                        <div className='app-actions-contianer'>
                            <Button variant="contained" color="primary" className='large-btn'
                                onClick={() => {
                                    if (loggedInUser === null || loggedInUser === undefined) {
                                        OpenGenericSnackBar(true, "Login to continue");
                                    } else {
                                        setShowBookAppointmentModal(true);
                                        setDoctor(doctor);
                                    }
                                }}
                            >
                                BOOK APPOINTMENT
                            </Button>
                            <Button variant="contained" className="green-btn large-btn"
                                onClick={() => {
                                    setshowDoctorDetails(true);
                                    setDoctor(doctor);
                                }}
                            >
                                VIEW DETAILS
                            </Button>
                        </div>
                    </Paper>
                ))}
            </div>
            <BookAppointment
                showBookAppointmentModal={showBookAppointmentModal}
                setShowBookAppointmentModal={setShowBookAppointmentModal}
                doctor={doctor}
            ></BookAppointment>
            <DoctorDetails
                showDoctorDetails={showDoctorDetails}
                setshowDoctorDetails={setshowDoctorDetails}
                doctor={doctor}
            ></DoctorDetails>
        </>
    );
}

export default DoctorList;
