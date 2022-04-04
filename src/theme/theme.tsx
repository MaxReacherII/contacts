import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import React, {useEffect, useState} from 'react';
import {themeStore} from "../store/themeStore";
import {observer} from "mobx-react-lite";

export const Theme: React.FC = observer((props) => {
    return(
        <ThemeProvider theme={themeStore.theme}>
            <CssBaseline/>
            {props.children}
        </ThemeProvider>
    )
})