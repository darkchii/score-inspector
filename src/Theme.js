import { createTheme, responsiveFontSizes } from "@mui/material";
import { IMG_TRIANGLES } from "./Helpers/Assets";

let DefaultTheme = createTheme({
    themeName: "osu!",
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8598A',
        },
        background: {
            default: '#18171C',
            dark: '#fff',
            paper: '#221F2Edd',
        },
    },
    shape: {
        borderRadius: 10
    },
    typography: {
        fontFamily: 'Comfortaa',
        fontWeight: 700,
        title: {
            color: '#C2B8E0',
            fontSize: 26,
            fontWeight: 500,
        },
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
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                    {
                        display: 'none',
                    },
                    '& input[type=number]': {
                        MozAppearance: 'textfield',
                    },
                },
            },
        },
    }
});
DefaultTheme = responsiveFontSizes(DefaultTheme);
export default DefaultTheme;