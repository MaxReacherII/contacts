import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import LoginMessage from "./LoginMessage";
import useAxios from "axios-hooks";
import {Container} from "@mui/material";

export default function App() {
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

    useEffect(() => {
        console.log(authStatus)
    }, [authStatus])

    const handleSubmit = (event: any) => {     //  <-- need type here
        event.preventDefault();
        if(event.nativeEvent.submitter.value === 'signup') {
            registrationUser({data: {email: event.target[0].value, password: event.target[2].value}})
                .then((res) => {
                    console.log(res)
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
                            setAuthStatus({type: 'error', message: 'Error with login or password'})
                    }
                })
        }
        if(event.nativeEvent.submitter.value === 'signin') {
            loginUser({data: {email: event.target[0].value, password: event.target[2].value}})
                .then((res) => {
                    console.log(res)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    return(
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5}}
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
                        fullWidth
                        variant='outlined'
                        name='email'
                        label='Email'
                        type='email'

                    />
                    <TextField
                        margin='normal'
                        fullWidth
                        variant='outlined'
                        name='password'
                        label='Password'
                        type='password'

                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        value="signin"
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
                        sx={{mt:2}}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}