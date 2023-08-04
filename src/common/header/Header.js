import "./Header.css";
import { Button, Card, CardHeader, Tabs, Tab } from '@material-ui/core';
import logo from "../../assets/logo.jpeg";
import { useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import Login from "../../screens/login/Login";
import { useContext } from "react";
import { SnackbarContext, UserContext } from "../../screens/Controller";
import { fetchData } from "../../util/fetch";
import Register from "../../screens/register/Register";

export const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '340px',
        minHeight: 'fit-content',
        overflow: 'auto',
        padding: '0px',
    },
};

const Header = () => {
    const { loggedInUser, setLoggedInUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const openModal = () => { setIsModalOpen(true); }
    const closeModal = () => { setIsModalOpen(false); }
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const { OpenGenericSnackBar } = useContext(SnackbarContext);
    const logout = () => {
        fetchData('auth/logout',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + loggedInUser.accessToken,
                },
            },
            OpenGenericSnackBar
        );
        sessionStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
    }

    return (
        <div className="app-header">
            <img className="app-logo" src={logo} alt="logo"></img>
            <span className="app-name">Doctor Finder</span>
            <div className="float-right">
                {loggedInUser === undefined || loggedInUser === null ?
                    <Button variant="contained" color="primary" onClick={openModal}>LOGIN</Button>
                    :
                    <Button variant="contained" color="secondary" onClick={logout}>LOGOUT</Button>
                }
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customModalStyles}
                contentLabel="Login/Register"
            >
                <Card style={{ height: 'calc(100% - 70px)' }}>
                    <CardHeader className="modal-header" title="Authentication" />
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Login" value="login" />
                        <Tab label="Register" value="register" />
                    </Tabs>

                    {activeTab === 'login' && (
                        <Login
                            closeModal={closeModal}
                        ></Login>
                    )}

                    {activeTab === 'register' && (
                        <Register
                            closeModal={closeModal}
                        ></Register>
                    )}
                </Card>
            </Modal>
        </div>
    );
}

export default Header;