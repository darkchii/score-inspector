import { Alert } from "@mui/material";

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