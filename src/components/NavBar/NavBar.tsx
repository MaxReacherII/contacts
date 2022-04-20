import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import ThemeSwitch from "./ThemeSwitch";
import {observer} from "mobx-react-lite";
import {userStore} from "../../store/userStore";

const MenuButton = styled(Button)<ButtonProps>(() => ({
    color: 'white',
    marginRight: 15
}))

const NavBar = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleContacts = () => {
        if(location.pathname !== '/contacts') {
            navigate('/contacts')
        }
    }

    const handleLogout = () => {
        userStore.userData = {
            email: '',
            access_token: ''
        }
        sessionStorage.clear()
        navigate('/')
    }

    return(
        <AppBar position='fixed' sx={{backgroundColor: 'primary.main'}}>
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
                    <ThemeSwitch />
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
})

export default NavBar;