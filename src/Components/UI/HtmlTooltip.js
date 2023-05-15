import { Tooltip, styled, tooltipClasses, withTheme } from "@mui/material";

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
    },
}));

export default HtmlTooltip;
