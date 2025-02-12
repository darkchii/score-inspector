import { Box } from "@mui/material";

function ClanTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            // hidden={value !== index}
            style={{
                display: value === index ? 'block' : 'none',
            }}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export default ClanTabPanel;