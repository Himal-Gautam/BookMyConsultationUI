import { FormControl, InputLabel, Input, FormHelperText, Button, Box } from '@material-ui/core';
import { useContext } from 'react';
import { useState } from 'react';
import { fetchData } from '../../util/fetch';
import { SnackbarContext, UserContext } from '../Controller';

export const LoginAction = async (auth, closeModal, setLoggedInUser, OpenGenericSnackBar) => {
    const [loginRespose, hasError] = await fetchData('auth/login',
        {
            method: 'POST',
            auth,
        },
        OpenGenericSnackBar
    );
    if (loginRespose && !hasError) {
        sessionStorage.setItem('loggedInUser', loginRespose);
        setLoggedInUser(JSON.parse(loginRespose));
        closeModal();
    }
}

const Login = ({ closeModal }) => {
    const [formValues, setFormValues] = useState({ 'login-email': '', 'login-password': '' });
    const [errors, setErrors] = useState({ 'login-email': false, 'login-password': false });
    const [isValidEmail, setValidEmail] = useState(true);
    const { setLoggedInUser } = useContext(UserContext);
    const { OpenGenericSnackBar } = useContext(SnackbarContext);

    const handleChange = (event) => {
        setFormValues({ ...formValues, [event.target.id]: event.target.value });
        setErrors({ ...errors, [event.target.id]: false });
        if (event.target.id === 'login-email') {
            setValidEmail(true);
        }
    };

    const validateChange = (event) => {
        const [newErrors, isError] = validate(event.target.id, event.target.value, { ...errors });
        setErrors(newErrors);
        if (!isError && event.target.id === 'login-email') {
            setValidEmail(validateEmail(event.target.value));
        }
    }

    const validate = (id, val, newErrors) => {
        let isError = false;
        if (!val) {
            isError = true;
        }
        newErrors[id] = isError;
        return [newErrors, isError];
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const handleLogin = async () => {
        let proceedLogin = true;
        let isError = false;
        let newErrors = { ...errors };
        Object.entries(formValues).forEach(([key, value]) => {
            [newErrors, isError] = validate(key, value, newErrors);
            proceedLogin = proceedLogin && !isError;
        });
        if (!validateEmail(formValues['login-email'])) {
            proceedLogin = false;
            setValidEmail(false);
        }
        if (proceedLogin) {
            LoginAction(
                {
                    username: formValues['login-email'],
                    password: formValues['login-password'],
                },
                closeModal, setLoggedInUser, OpenGenericSnackBar
            );
        }
    }
    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexWrap: 'wrap',
                height: 'calc(100% - 48px)',
                padding: '18px',
            }}
            noValidate
        >
            <FormControl>
                <InputLabel required>Email</InputLabel>
                <Input id='login-email' value={formValues['login-email']} onChange={handleChange} onBlur={validateChange} />
                {errors['login-email'] && <span className="button-message">Please fill out this field</span>}
                {!isValidEmail && <FormHelperText style={{ color: 'red' }} id="component-error-text">Enter valid Email</FormHelperText>}
            </FormControl>
            <FormControl>
                <InputLabel required>Password</InputLabel>
                <Input id='login-password' type="password" value={formValues['login-password']} onChange={handleChange} onBlur={validateChange} />
                {errors['login-password'] && <span className="button-message">Please fill out this field</span>}
            </FormControl>
            <Button variant="contained" className="modal-action-button" color='primary' onClick={handleLogin}>
                LOGIN
            </Button>
        </Box>
    );
}

export default Login;