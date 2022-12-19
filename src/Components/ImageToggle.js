import { Box } from "@mui/material";
import React, { useEffect } from "react";

function ImageToggle(props) {
    const [checked, setChecked] = React.useState(props.checkedDefault);

    const handleClick = () => {
        const _ch = !checked;
        setChecked(_ch);

        props.onClick(_ch);
    }

    useEffect(() => {
        console.log(checked);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Box component="img" sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                    transition: 'all 0.2s ease',
                    transform: 'scale(1.2)',
                    cursor: 'pointer'
                },
                ...(!checked && {
                    opacity: '40%',
                }),
                ...props.sx
            }} height={props.height} src={props.src} alt={props.alt} onClick={handleClick} />
        </>
    );
}
export default ImageToggle;