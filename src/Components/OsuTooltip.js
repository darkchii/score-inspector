import { styled, Tooltip } from "@mui/material";

//styling
const LocalStyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    background-color: rgba(0,0,0,0.9);
    font-size: 18px;
    padding: 10px;
    font-weight: regular;
`);

function OsuTooltip(props) {
    return (
        <LocalStyledTooltip
            title={props.title}
            placement={'bottom-start'}
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [20, 20],
                            },
                        },
                    ],
                },
            }}
            followCursor>
            {props.children}
        </LocalStyledTooltip>
    )
}

export default OsuTooltip;