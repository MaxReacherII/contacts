import React from 'react';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from './components/Login/Login';
import Contacts from './components/Contacts/Contacts';
import NavBar from './components/NavBar/NavBar';
import Box from '@mui/material/Box';
import {Theme} from "./theme/theme";
import Typography from "@mui/material/Typography";

function Copyright() {
    return(
        <Typography
            sx={{
                textAlign: 'center',
                marginBottom: 1
            }}
        >
            Copyright © {new Date().getFullYear()} Your Website
        </Typography>
    )
}

function App() {
    return (
        <div className="App">
            <Theme>
                <Router>
                    <NavBar />
                    <Box
                        mx='auto'
                        sx={{
                            height: '85vh',
                            width: '85vh',
                            marginTop: '10vh',
                            marginBottom: '1vh',
                            border: '1px solid',
                            borderColor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: '0 0 10px rgba(0,0,0,0.4)',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Routes>
                            <Route path='contacts' element={<Contacts />} />
                            <Route path='/' element={<Login />} />
                        </Routes>
                    </Box>
                    <Copyright/>
                </Router>
            </Theme>
        </div>
    );
}

export default App;