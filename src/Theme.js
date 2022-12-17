import { IMG_TRIANGLES } from "./Helpers/Assets";

const DefaultTheme = {
    themeName: "osu!",
    palette: {
        mode: 'dark',
        primary: {
            main: '#C8598A',
        },
        background: {
            default: '#18171C',
            dark: '#fff',
            paper: '#221F2E',
        },
    },
    shape: {
        borderRadius: 0
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
        }
    }
}

export default DefaultTheme;