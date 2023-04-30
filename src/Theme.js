import { createTheme, responsiveFontSizes } from "@mui/material";

let DefaultTheme = createTheme({
    themeName: "osu!",
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8598A',
        },
        background: {
            default: '#171C1A',
            dark: '#fff',
            paper: '#222A27',
        },
    },
    shape: {
        borderRadius: 10
    },
    typography: {
        fontFamily: 'Comfortaa',
        fontWeight: 700,
        title: {
            color: '#66FFCC',
            fontSize: 26,
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
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