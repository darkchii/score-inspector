import * as d3 from 'd3';

const displayRank = {
    "A": "A",
    "B": "B",
    "C": "C",
    "D": "D",
    "S": "S",
    "SH": "S",
    "X": "SS",
    "XH": "SS"
}

function ScoreDial(props) {
    const arc = d3.arc();
    const pie = d3.pie().sortValues(null);
    const valueData = [props.accuracy, 1 - props.accuracy];

    return (
        <div className="score_dial">
            <div className='score_dial_layer'>
                <svg viewBox='0 0 200 200'>
                    <defs>
                        <linearGradient gradientTransform='rotate(90)' id='dial-outer'>
                            <stop className='score_dial_outer_gradient score-dial_outer_gradient_start' offset='0%' />
                            <stop className='score_dial_outer_gradient score-dial_outer_gradient_end' offset='100%' />
                        </linearGradient>
                    </defs>
                    <g transform="translate(100,100)">
                        {
                            pie(props.rankCutoffs).map((d) => (
                                <path
                                    key={d.index}
                                    className={`score_dial_inner score_dial_inner-${d.index}`}
                                    d={arc({ innerRadius: 68, outerRadius: 73, ...d }) ?? undefined}
                                />
                            ))
                        }
                        {
                            pie(valueData).map((d) => (
                                <path
                                    key={d.index}
                                    className={`score_dial_outer score_dial_outer-${d.index}`}
                                    d={arc({ innerRadius: 75, outerRadius: 100, ...d }) ?? undefined}
                                />
                            ))
                        }
                    </g>
                </svg>
            </div>

            <div className='score_dial_layer score_dial_layer_grade'>
                <span>{displayRank[props.rank]}</span>
            </div>
        </div>
    );
}

export default ScoreDial;