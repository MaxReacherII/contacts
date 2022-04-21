import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import LoginMessage from "./LoginMessage";
import {registerUser, loginUser} from "../../api/login";
import {Container} from "@mui/material";
import {userStore} from "../../store/userStore";

export default function App() {
    const [authType, setAuthType] = useState('')
    const [authStatus, setAuthStatus] = useState({
        type: 'text',
        message: 'Please login or register'
    });
    const navigate = useNavigate();

    const handleTypeSubmit = (event: React.MouseEvent) => {
        const target = event.target as HTMLButtonElement;
        setAuthType(target.value)
    }

    useEffect(() => {
        userStore.userData.access_token && navigate('/contacts')
    }, [])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        if(authType === 'signup') {
            registerUser({email: email, password: password})
                .then(() => {
                    setAuthStatus({type: 'success', message: 'Registered successfully'})
                })
                .catch((e) => {
                    setAuthStatus({type: 'error', message: e.response.data.message})
                })
        }
        if(authType === 'signin') {
            loginUser({email: email, password: password})
                .then((res) => {
                    userStore.signIn(res.data)
                    navigate('/contacts')
                })
                .catch((e) => {
                    setAuthStatus({type: 'error', message: e.response.data.message})
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