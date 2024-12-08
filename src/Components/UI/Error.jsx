import { Typography } from "@mui/material";

function Error() {
    return (
        <div style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            minHeight: '120px',
            borderRadius: '10px',
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Typography variant="h6" style={{ color: "white" }}>API Error</Typography>
        </div>
    )
}

export default Error;