import Header from "../../common/header/Header";
import { Tabs, Tab } from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import { Snackbar } from '@material-ui/core';
import { SnackbarContext } from "../Controller";
import { useContext, useState } from "react";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";

const Home = () => {
    const { showSnackBar, snackBarMsg, OpenGenericSnackBar } = useContext(SnackbarContext);
    const [activeTab, setActiveTab] = useState('doctors');
    const handleSnackBarClose = () => {
        OpenGenericSnackBar(false, snackBarMsg);
    }
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    return (
        <>
            <Header></Header>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
            >
                <Tab label="Doctors" value="doctors" />
                <Tab label="Appointment" value="appointment" />
            </Tabs>
            {activeTab === 'doctors' && (
                <DoctorList></DoctorList>
            )}

            {activeTab === 'appointment' && (
                <Appointment></Appointment>
            )}
            <Snackbar
                open={showSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <Alert onClose={handleSnackBarClose} severity="error">
                    {snackBarMsg}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Home;