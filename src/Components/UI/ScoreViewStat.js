import { Tooltip, useTheme } from "@mui/material";
import { useSpring, animated } from '@react-spring/web';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import * as d3 from 'd3';


function ScoreViewStat(props) {
    const theme = useTheme();
    const arc = d3.arc();
    const pie = d3.pie().sortValues(null);
    const springData = useSpring({
        from: {
            pos: [0]
        },
        to: {
            //radians
            pos: [(props.progress * 360) * (Math.PI / 180)]
        },
        config: {
            duration: 1000,
            easing: d3.easeCubic
        }
    })

    return (
        <Tooltip title={props.tooltip ?? ''}>
            <div className={`score-stats__stat${props.small ? '-small' : ''}`} style={{
                opacity: props.irrelevant ? '0.5' : undefined,
                backgroundColor: props.backgroundColor ?? undefined,
            }}>
                <div className={`score-stats__stat-row score-stats__stat-row--label${props.small ? '-small' : ''}`} style={{
                    color: props.labelColor ?? undefined,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {props.labelIcon ?? null}
                    {props.label}

                    {/* add a colored horizontal line of 30px wide on the far right if props.lineDecorator is true */}
                    {props.lineDecorator ? <div style={{
                        width: '20px',
                        height: '4px',
                        backgroundColor: props.labelColor ?? theme.palette.text.primary,
                        marginLeft: '1em',
                        borderRadius: '20px',
                    }}></div> : null}
                </div>
                <div className={`score-stats__stat-row${props.small ? '-small' : ''}`} style={{
                    color: props.valueColor ?? undefined,
                    display: 'flex',
                    justifyContent: 'space-between',

                }}>
                    <span style={{
                        //align the icon with the text
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        {
                            props.originalValue ?
                                //this should be slightly smaller and gray
                                <span style={{
                                    fontSize: '0.8em',
                                    color: theme.palette.text.secondary,
                                    display: 'flex',
                                    alignItems: 'center',

                                }}>
                                    {props.originalValue}
                                    <KeyboardArrowRightIcon sx={{ fontSize: '1em' }} />
                                </span> : null
                        }
                        {props.value}
                        {props.valueIcon ?? null}
                    </span>

                    {/* progress circle on the far right, use inline styling, theres no class */}
                    {props.progress !== undefined ?
                        <div style={{
                            height: 'inherit',
                            width: '1em',
                            marginLeft: '1em',
                        }}>
                            <svg viewBox='0 0 26 26'>
                                <defs>
                                    <linearGradient gradientTransform='rotate(90)' id='dial-outer'>
                                        <stop className='score-dial_outer_gradient_start' offset='0%' />
                                        <stop className='score-dial_outer_gradient_end' offset='100%' />
                                    </linearGradient>
                                </defs>
                                <g transform="translate(13,13)">
                                    {
                                        // pie([props.progress, 1 - props.progress]).map((d, i) => (
                                        <animated.path
                                            className={`score_dial_outer score_dial_outer-0`}
                                            d={
                                                springData.pos.to((prog) => {
                                                    return arc({ innerRadius: 10, outerRadius: 13, startAngle: 0, endAngle: prog })
                                                })
                                            }
                                        />
                                        // ))
                                    }
                                </g>
                            </svg>
                        </div>
                        : null
                    }
                </div>
            </div>
        </Tooltip>
    );
}

export default ScoreViewStat;