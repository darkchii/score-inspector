import { useTheme } from "@mui/material";
import { BarChart as CoreBarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
function BarChart(props){
    const theme = useTheme();
    const [_props, setProps] = useState(null);

    useEffect(()=>{
        const _clonedProps = props;
        if(_clonedProps?.series?.[0] && !_clonedProps?.series?.[0]?.color){
            _clonedProps.series[0].color = theme.palette.primary.main;
            console.log(`No color provided for BarChart, using primary color (${theme.palette.primary.main})`);
        }
        setProps(_clonedProps);
    }, []);

    if(!_props){
        return null;
    }

    return (
        <CoreBarChart {..._props} />
    )
}

export default BarChart;