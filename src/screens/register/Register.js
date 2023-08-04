import { FormControl, InputLabel, Input, FormHelperText, Button, Box } from '@material-ui/core';
import { useContext } from 'react';
import { useState } from 'react';
import { fetchData } from '../../util/fetch';
import { SnackbarContext, UserContext } from '../Controller';
import { LoginAction } from '../login/Login';


const Register = ({ closeModal }) => {
    const [formValues, setFormValues] = useState({
        'register-first-name': '',
        'register-last-name': '',
        'register-email': '',
        'register-password': '',
        'register-mobile': '',
    });
    const [errors, setErrors] = useState({
        'register-first-name': false,
        'register-last-name': false,
        'register-email': false,
        'register-password': false,
        'register-mobile': false,
    });
    const [isValidEmail, setValidEmail] = useState(true);
    const [isValidMobile, setValidMobile] = useState(true);
    const { setLoggedInUser } = useContext(UserContext);
    const { OpenGenericSnackBar } = useContext(SnackbarContext);

    const handleChange = (event) => {
        setFormValues({ ...formValues, [event.target.id]: event.target.value });
        setErrors({ ...errors, [event.target.id]: false });
        setValidEmail(true);
    };

    const validateChange = (event) => {
        const [newErrors, isError] = validate(event.target.id, event.target.value, { ...errors });
        setErrors(newErrors);
        if (!isError) {
            if (event.target.id === 'register-email') {
                setValidEmail(validateEmail(event.target.value));
            } else if (event.target.id === 'register-mobile') {
                setValidMobile(validateMobile(event.target.value));
            }
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

    const validateMobile = (mobile) => {
        return /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i.test(mobile);
    }

    const handleRegister = async () => {
        let proceedRegister = true;
        let isError = false;
        let newErrors = { ...errors };
        Object.entries(formValues).forEach(([key, value]) => {
            [newErrors, isError] = validate(key, value, newErrors);
            proceedRegister = proceedRegister && !isError;
        });
        if (!validateEmail(formValues['register-email'])) {
            proceedRegister = false;
            setValidEmail(false);
        }
        if (!validateMobile(formValues['register-mobile'])) {
            proceedRegister = false;
            setValidMobile(false);
        }
        if (proceedRegister) {
            const [, hasError] = await fetchData('users/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emailId: formValues['register-email'],
                        firstName: formValues['register-first-name'],
                        lastName: formValues['register-last-name'],
                        mobile: formValues['register-mobile'],
                        password: formValues['register-password'],
                    }),
                },
                OpenGenericSnackBar
            );
            if (!hasError) {
                LoginAction(
                    {
                        username: formValues['register-email'],
                        password: formValues['register-password'],
                    },
                    closeModal, setLoggedInUser, OpenGenericSnackBar
                );
            }
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
                <InputLabel required>First Name</InputLabel>
                <Input id='register-first-name' value={formValues['register-first-name']} onChange={handleChange} onBlur={validateChange} />
                {errors['register-first-name'] && <span className="button-message">Please fill out this field</span>}
            </FormControl>
            <FormControl>
                <InputLabel required>Last Name</InputLabel>
                <Input id='register-last-name' value={formValues['register-last-name']} onChange={handleChange} onBlur={validateChange} />
                {errors['register-last-name'] && <span className="button-message">Please fill out this field</span>}
            </FormControl>
            <FormControl>
                <InputLabel required>Email</InputLabel>
                <Input id='register-email' value={formValues['register-email']} onChange={handleChange} onBlur={validateChange} />
                {errors['register-email'] && <span className="button-message">Please fill out this field</span>}
                {!isValidEmail && <FormHelperText style={{ color: 'red' }} id="component-error-text">Enter valid Email</FormHelperText>}
            </FormControl>
            <FormControl>
                <InputLabel required>Password</InputLabel>
                <Input id='register-password' type="password" value={formValues['register-password']} onChange={handleChange} onBlur={validateChange} />
                {errors['register-password'] && <span className="button-message">Please fill out this field</span>}
            </FormControl>
            <FormControl>
                <InputLabel required>Mobile No.</InputLabel>
                <Input id='register-mobile' value={formValues['register-mobile']} onChange={handleChange} onBlur={validateChange} />
                {errors['register-mobile'] && <span className="button-message">Please fill out this field</span>}
                {!isValidMobile && <FormHelperText style={{ color: 'red' }} id="component-error-text">Enter valid mobile number</FormHelperText>}
            </FormControl>
            <Button variant="contained" className="modal-action-button" color='primary' onClick={handleRegister}>
                REGISTER
            </Button>
        </Box>
    );
}

export default Register;