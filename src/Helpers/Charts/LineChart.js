/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from "@mui/material";
import { LineChart as CoreLineChart } from "@mui/x-charts";
import { useState } from "react";
import { useEffect } from "react";

function LineChart(props){
    const theme = useTheme();
    const [_props, setProps] = useState(null);

    useEffect(()=>{
        const _clonedProps = props;
        if(_clonedProps?.series?.[0] && !_clonedProps?.series?.[0]?.color){
            _clonedProps.series[0].color = theme.palette.primary.main;
            console.log(`No color provided for LineChart, using primary color (${theme.palette.primary.main})`);
        }
        setProps(_clonedProps);
    }, []);

    if(!_props){
        return null;
    }

    if(!_props.series){
        console.error("No series provided for LineChart");
        return null;
    }

    if(!_props.xAxis){
        console.error("No xAxis provided for LineChart");
        return null;
    }

    return (
        <CoreLineChart {..._props} />
    )
}

export default LineChart;