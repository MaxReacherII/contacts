import {makeAutoObservable} from "mobx";
import {createTheme} from "@mui/material/styles";
import {PaletteMode} from "@mui/material";

const genTheme = (type: PaletteMode) => {
    return createTheme({
        typography: {
            fontFamily: 'Roboto',
        },
        palette: {
            mode: type,
            primary: {
                main: '#3f51b5',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: type==='dark' ? '#303030' : '#fafafa',
                paper: type==='dark' ? '#424242' : '#fff'
            }
        },
    })
}

class ThemeStore {
    constructor() {
        makeAutoObservable(this)
    }

    mode: PaletteMode = 'light'

    switchTheme = () => {
        this.mode === 'light' ? this.mode = 'dark' : this.mode = 'light'
    }

    get theme() {
        return genTheme(this.mode)
    }
}

export const themeStore = new ThemeStore();