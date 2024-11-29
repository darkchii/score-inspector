import { Box } from "@mui/material";
import GlowBar from "./GlowBar";

function GlowBarText(props){

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            ...props.sx
        }}>
            <GlowBar direction='left' />
            {props.children}
        </Box>
    )
}

export default GlowBarText;