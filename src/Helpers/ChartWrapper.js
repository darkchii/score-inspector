import { useTheme } from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";

const defaultProps = {
    options: {
        theme: {
            mode: 'dark'
        },
        grid: {
            borderColor: '#ffffff25',
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#fff',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#fff',
                },
            },
        },
        tooltip: {
            theme: 'dark',
        },
        chart: {
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
            }
        },
        stroke: {
            curve: 'smooth',
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: 'dark',
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: []
        }
    },
    width: '100%',
    height: '100%',
    style: {
        margin: '1rem'
    }
}

function ChartWrapper(props) {
    const [_props, setProps] = useState(props);

    useEffect(() => {
        const defaults = _.cloneDeep(defaultProps);
        const temp_props = _.merge(defaults, props);
        setProps(temp_props);
    }, [props]);

    return (
        <Chart
            {..._props}
        />
    )
}

export default ChartWrapper;