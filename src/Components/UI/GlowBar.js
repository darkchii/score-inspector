import { Box, useTheme } from "@mui/material";

function GlowBar(props) {
    const theme = useTheme();
    const _props = {
        direction: 'left',
        size: '4px',
        length: '100%',
        color: theme.typography.title.color,
        offset: 8,
        ...props
    };

    return (
        <Box sx={{
            position: 'absolute',
            left: _props.direction === 'left' ? -_props.offset : undefined,
            right: _props.direction === 'right' ? -_props.offset : undefined,
            top: _props.direction === 'top' ? -_props.offset : undefined,
            bottom: _props.direction === 'bottom' ? -_props.offset : undefined,
            borderRadius: 3,
            // height: '100%',
            height: _props.direction === 'left' || _props.direction === 'right' ? _props.length : _props.size,
            width: _props.direction === 'top' || _props.direction === 'bottom' ? _props.length : _props.size,            
            backgroundColor: _props.color,
            boxShadow: `0px 0px 4px 2px ${_props.color}22`,
            ..._props.sx
        }} />
    )
}

export default GlowBar;