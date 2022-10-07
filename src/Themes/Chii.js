import {
    experimental_sx as sx,
} from '@mui/material/styles';
import { shadows } from '@mui/system';
import { IMG_TRIANGLES, SVG_TRIANGLES } from "../Assets";
const borderSize = '5px';

const DefaultTheme = {
    themeName: "Chii",
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8598A',
        },
        background: {
            default: '#16212e',
            dark: '#fff',
            paper: '#1b283877',
            paper2: '#1b2838FF',
        },
    },
    shape: {
        borderRadius: borderSize,
    },
    typography: {
        fontFamily: 'Comfortaa',
        fontWeight: 700
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    height: '100%',
                },
                body: {
                    backgroundImage: 'linear-gradient(#123 60%, #333)',
                    backgroundAttachment: 'fixed',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    alignItems: 'center',
                    backgroundColor: '#1b2838bb',
                    display: 'flex',
                    color: 'white',
                    textDecoration: 'none',
                    userSelect: 'none',
                    transition: '0.1s ease-in-out',
                    borderLeftColor: `#FF66AA55`,
                    borderLeftStyle: 'solid',
                    borderLeftWidth: '5px',
                    '&:hover': {
                        backgroundColor: '#1b2838',
                        borderLeftColor: `#FF66AA`,
                        borderLeftWidth: '15px',
                        borderLeftStyle: 'solid',
                        boxShadow: `0px 0px 10px 0px #FF66AA55`,
                    }
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    m: 2,
                    p: 0.5,
                }
            }
        }
    }
}

export default DefaultTheme;