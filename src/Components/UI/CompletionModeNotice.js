import { Alert } from "@mui/material";

function CompletionModeNotice(){
    return <>
        <Alert severity="info">
            User has enabled completion mode. This section is disabled.
        </Alert>
    </>
}

export default CompletionModeNotice;