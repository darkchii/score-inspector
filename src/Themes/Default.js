import {
    experimental_sx as sx,
} from '@mui/material/styles';
import { shadows } from '@mui/system';
import { IMG_TRIANGLES, SVG_TRIANGLES } from "../Assets";

const DefaultTheme = {
    themeName: "osu!",
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8598A',
        },
        background: {
            default: '#2A2226',
            dark: '#fff',
            paper: '#382E32',
            paper2: '#382E32',
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
                    backgroundImage: 'url(' + IMG_TRIANGLES + ')',
                    backgroundSize: '175%',
                    transition: 'all .12s ease-in-out',
                    '--bg-move': '0px',
                    backgroundPosition: 'calc(50% + var(--bg-move)) 50%',
                    '&:hover': {
                        '--bg-move': '-10px',
                    }
                },
            }
        }
    }
}

export default DefaultTheme;