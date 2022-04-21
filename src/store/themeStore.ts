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
                main: '#3f51b5'
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: type==='dark' ? '#303030' : '#fafafa',
                paper: type==='dark' ? '#424242' : '#fff'
            },
            info: {
                main: '#29b6f6'
            }
        }
    })
}

class ThemeStore {
    constructor() {
        makeAutoObservable(this)
    }

    mode: PaletteMode = localStorage.getItem('theme') ? (localStorage.getItem('theme')==="dark" ? "dark" : "light") : "light"

    switchTheme = () => {
        this.mode === 'light' ? this.mode = 'dark' : this.mode = 'light'
    }

    get theme() {
        localStorage.setItem('theme', this.mode)
        return genTheme(this.mode)
    }
}

export const themeStore = new ThemeStore();