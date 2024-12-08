import { Box, Button } from "@mui/material";
import { IMG_TRIANGLES } from "../Helpers/Assets";

// This button has random outlined triangles on it that move from bottom to top
function OsuButton(props) {
    return <Button {...props} sx={{ overflow: 'hidden', ...props.sx }}>
        <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${IMG_TRIANGLES})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            opacity: 0.1
        }}></Box>
        {props.children}
    </Button>
}

export default OsuButton;