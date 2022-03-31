import React from 'react';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from './components/Login/Login';
import Contacts from './components/Contacts/Contacts';
import NavBar from './components/NavBar/NavBar';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme()

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
          <Router>
              <NavBar />
              <Box
                  mx='auto'
                  my='10vh'
                  sx={{height: '85vh', width: '85vh', border: '1px solid #dedede', borderRadius: 1, boxShadow: '0 0 10px rgba(0,0,0,0.4)' }}
              >
                  <Routes>
                      <Route path='/' element={<Login />} />
                      <Route path='contacts' element={<Contacts />} />
                  </Routes>
              </Box>
          </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;