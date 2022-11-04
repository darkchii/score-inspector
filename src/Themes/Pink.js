import {
    experimental_sx as sx,
} from '@mui/material/styles';
import { shadows } from '@mui/system';

const PinkTheme = {
    themeName: "Pink",
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8598A',
        },
        background: {
            default: '#4d0227',
            dark: '#fff',
            paper: '#690a30',
            paper2: '#690a30',
        },
    },
    shape: {
        borderRadius: 0
    },
    typography: {
        fontFamily: 'Comfortaa',
        fontWeight: 700,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    borderRadius: '10px'
                },
            }
        }
    }
}

export default PinkTheme;