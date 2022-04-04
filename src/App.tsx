import React from 'react';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from './components/Login/Login';
import Contacts from './components/Contacts/Contacts';
import NavBar from './components/NavBar/NavBar';
import Box from '@mui/material/Box';
import {Theme} from "./theme/theme";

function App() {
    return (
        <div className="App">
            <Theme>
                <Router>
                    <NavBar />
                    <Box
                        mx='auto'
                        my='10vh'
                        sx={{
                            height: '85vh',
                            width: '85vh',
                            border: '1px solid',
                            borderColor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: '0 0 10px rgba(0,0,0,0.4)',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Routes>
                            <Route path='/' element={<Login />} />
                            <Route path='contacts' element={<Contacts />} />
                        </Routes>
                    </Box>
                </Router>
            </Theme>
        </div>
    );
}

export default App;