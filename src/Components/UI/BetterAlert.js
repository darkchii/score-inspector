import { Alert, Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";

function BetterAlert(props) {
    return (
        <>
            <Alert
                severity={props.severity}
                sx={{
                    borderRadius: '10px',
                    padding: '5px',
                }}>
                {props.children}
            </Alert>
        </>
    )
}

export default BetterAlert;