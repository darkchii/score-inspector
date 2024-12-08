import { createTheme, responsiveFontSizes } from "@mui/material";

let DefaultTheme = createTheme({
    themeName: "osu!",
    palette: {
        mode: 'dark',
        primary: {
            //hsl(330deg ,100%,70%)
            main: '#FF66B3',
        },
        background: {
            default: '#1C171A',
            dark: '#fff',
            paper: '#2A2226',
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: 'Torus',
        fontWeight: 700,
        title: {
            color: '#66FFCC',
            fontSize: 22,
            fontWeight: 500,
        },
        button: {
            //add shadow to button text
            textShadow: '0px 1px 2px #00000080',
            //no force capitalization
            textTransform: 'none',
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '9999px',
                    color: '#fff',
                },
                sizeMedium: {
                    paddingLeft: '40px',
                    paddingRight: '40px',
                },
            },
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
        }
    }
});
DefaultTheme = responsiveFontSizes(DefaultTheme);
export default DefaultTheme;