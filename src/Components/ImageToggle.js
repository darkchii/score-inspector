import { Box } from "@mui/material";
import React, { useEffect } from "react";

function ImageToggle(props) {
    const [checked, setChecked] = React.useState(props.checkedDefault);

    const handleClick = () => {
        if (props.disabled) return;
        const _ch = !checked;
        setChecked(_ch);

        props.onClick(_ch);
    }

    useEffect(() => {
        setChecked(props.checkedDefault);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.checkedDefault]);

    return (
        <>
            <Box component="img" sx={{
                transition: 'all 0.2s ease',
                ...(!props.disabled && {
                    '&:hover': {
                        transition: 'all 0.2s ease',
                        transform: 'scale(1.2)',
                        cursor: 'pointer'
                    },
                }),
                ...(!checked && {
                    opacity: '40%',
                }),
                //grey out the image if disabled
                ...(props.disabled && {
                    filter: 'grayscale(100%)',
                    scale: '0.8',
                }),
                ...props.sx
            }} height={props.height} src={props.src} alt={props.alt} onClick={handleClick} />
        </>
    );
}
export default ImageToggle;