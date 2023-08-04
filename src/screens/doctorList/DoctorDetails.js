import {
    Card,
    CardHeader,
    CardContent,
    Typography
} from '@material-ui/core';
import { Rating } from "@material-ui/lab";
import Modal from "react-modal/lib/components/Modal";
import { customModalStyles } from '../../common/header/Header';

const DoctorDetails = ({ showDoctorDetails, setshowDoctorDetails, doctor }) => {
    return (
        <Modal
            isOpen={showDoctorDetails}
            onRequestClose={() => setshowDoctorDetails(false)}
            style={customModalStyles}
            contentLabel="Book an Appointment"
        >
            <Card>
                <CardHeader className="modal-header" title="Doctor Details" />
                <CardContent className='book-appointment-form'>
                    <Typography variant="h6">Dr: {doctor?.firstName + " " + doctor?.lastName}</Typography>
                    <Typography variant="h6">Total Experience: {doctor?.totalYearsOfExp} years</Typography>
                    <Typography variant="h6">Speciality: {doctor?.speciality}</Typography>
                    <Typography variant='h6'>Date of Birth : {doctor?.dob}</Typography>
                    <Typography variant='h6'>City: {doctor?.address?.city}</Typography>
                    <Typography variant='h6'>Email: {doctor?.emailId}</Typography>
                    <Typography variant='h6'>Mobile: {doctor?.mobile}</Typography>
                    <Typography variant="h6">Rating:
                        <Rating
                            name="simple-controlled"
                            value={doctor.rating}
                        />
                    </Typography>
                </CardContent>
            </Card>
        </Modal>
    );
}

export default DoctorDetails;