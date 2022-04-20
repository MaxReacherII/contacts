import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import LoginMessage from "./LoginMessage";
import useAxios from "axios-hooks";
import {Container} from "@mui/material";
import {userStore} from "../../store/userStore";

export default function App() {
    const [authType, setAuthType] = useState('')
    const [authStatus, setAuthStatus] = useState({
        type: 'text',
        message: 'Please login or register'
    });
    const [{ data: registrationData}, registrationUser] = useAxios({
        url: 'http://localhost:4000/auth/register',
        method: 'POST'
    }, {manual: true})

    const [{data: loginData}, loginUser] = useAxios({
        url: 'http://localhost:4000/auth/login',
        method: 'POST'
    }, {manual: true})
    const navigate = useNavigate();

    const handleTypeSubmit = (event: React.MouseEvent) => {
        const target = event.target as HTMLButtonElement;
        setAuthType(target.value)
    }

    useEffect(() => {
        userStore.userData.access_token && navigate('/contacts')
    })

    const handleSubmit = (event: React.FormEvent) => {     //  <-- need type here
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        if(authType === 'signup') {
            registrationUser({data: {email: email, password: password}})
                .then((res) => {
                    setAuthStatus({type: 'success', message: 'Registered successfully'})
                })
                .catch((e) => {
                    switch (e.message.split(' ').pop()){
                        case '409':
                            setAuthStatus({type: 'error', message: 'User already exists'})
                            break;
                        case '404':
                            setAuthStatus({type: 'error', message: 'Auth Server is unavailable'})
                            break;
                        case '401':
                            setAuthStatus({type: 'error', message: 'Error with email or password'})
                            break;
                        case '403':
                            setAuthStatus({type: 'error', message: 'Incorrect email or password'})
                            break;
                    }
                })
        }
        if(authType === 'signin') {
            loginUser({data: {email: email, password: password}})
                .then((res) => {
                    userStore.userData = res.data
                    sessionStorage.setItem('email', res.data.email)
                    sessionStorage.setItem('access_token', res.data.access_token)
                    navigate('/contacts')
                })
                .catch((e) => {
                    console.log(e)
                    switch (e.message.split(' ').pop()){
                        case '403':
                            setAuthStatus({type: 'error', message: 'Incorrect email or password'})
                            break;
                        case '404':
                            setAuthStatus({type: 'error', message: 'Auth Server is unavailable'})
                            break;
                        case '401':
                            setAuthStatus({type: 'error', message: 'Error with login or password'})
                            break;
                    }
                })
        }
    }

    return(
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 5
                }}
            >
                <Typography
                    sx={{fontSize: 27, fontWeight: 'bold'}}
                >
                    Welcome to My Contacts App
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    sx={{mt:2}}
                >
                    <LoginMessage authStatus={authStatus}/>
                    <TextField
                        margin='normal'
                        color='info'
                        fullWidth
                        variant='filled'
                        name='email'
                        label='Email'
                        type='email'
                    />
                    <TextField
                        margin='normal'
                        color='info'
                        fullWidth
                        variant='filled'
                        name='password'
                        label='Password'
                        type='password'

                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        value="signin"
                        onClick={handleTypeSubmit}
                        sx={{mt:3}}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        type="submit"
                        color="inherit"
                        value="signup"
                        onClick={handleTypeSubmit}
                        sx={{mt:2}}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}