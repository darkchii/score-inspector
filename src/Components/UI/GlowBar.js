import { Box, useTheme } from "@mui/material";

function GlowBar(props) {
    const theme = useTheme();
    const _props = {
        direction: 'left',
        size: '4px',
        ...props
    };

    return (
        <Box sx={{
            position: 'absolute',
            left: _props.direction === 'left' ? -8 : undefined,
            right: _props.direction === 'right' ? -8 : undefined,
            top: _props.direction === 'top' ? -8 : undefined,
            bottom: _props.direction === 'bottom' ? -8 : undefined,
            borderRadius: 3,
            // height: '100%',
            height: _props.direction === 'left' || _props.direction === 'right' ? '100%' : _props.size,
            width: _props.direction === 'top' || _props.direction === 'bottom' ? '100%' : _props.size,            
            backgroundColor: theme.typography.title.color,
            boxShadow: `0px 0px 4px 2px ${theme.typography.title.color}22`,
            ..._props.sx
        }} />
    )
}

export default GlowBar;