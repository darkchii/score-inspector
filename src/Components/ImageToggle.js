import { Box, Checkbox, Grid, Link, styled, Switch, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { getModIcon, getPossibleMods } from "../Assets";
import { mods, mod_strings_long } from "../helper";

function ImageToggle(props) {
    const [checked, setChecked] = React.useState(props.checkedDefault);

    const handleClick = () => {
        const _ch = !checked;
        setChecked(_ch);

        props.onClick(_ch);
    }

    useEffect(()=>{
        console.log(checked); 
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