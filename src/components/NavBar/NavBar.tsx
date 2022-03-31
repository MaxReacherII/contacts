import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import useAxios from "axios-hooks";

const MenuButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: 'white',
    marginRight: 15
}))

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleContacts = () => {
        if(location.pathname !== '/contacts') {
            navigate('/contacts')
        }
    }

    const handleLogout = () => {
        //magic
        navigate('/')
    }

    return(
        <AppBar position='fixed'>
            <Toolbar >
                <div>
                    <Typography
                        variant='h5'
                        noWrap
                        sx={{ flexGrow: 1, display: { xs: 'flex' }}}
                    >
                        My Contacts App
                    </Typography>
                </div>
                <Box my={0} ml='auto' mr={0}>
                    <MenuButton onClick={handleContacts}>
                        Contacts
                    </MenuButton>
                    <MenuButton onClick={handleLogout}>
                        Logout
                    </MenuButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}