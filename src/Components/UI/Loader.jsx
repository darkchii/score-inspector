import { CircularProgress } from "@mui/material";

function Loader(props) {
    return (
        <div style={{
            top: 0,
            left: 0,
            width: "100%",
            height: props.height ?? "100%",
            minHeight: '120px',
            borderRadius: '10px',
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <CircularProgress />
        </div>
    )
}

export default Loader;