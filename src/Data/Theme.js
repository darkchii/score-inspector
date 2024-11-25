import { createTheme, responsiveFontSizes } from "@mui/material";

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
        fontFamily: 'Torus',
        fontWeight: 700,
        title: {
            color: '#66FFCC',
            fontSize: 22,
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '9999px'
                }
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