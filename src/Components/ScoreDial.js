import { animated, useSpring } from '@react-spring/web';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { getRankFromAccuracy, rankCutoffs } from '../Helpers/Osu';
import Mods from '../Helpers/Mods';

const displayRank = {
    "D": "D",
    "C": "C",
    "B": "B",
    "A": "A",
    "S": "S",
    "SH": "S",
    "X": "SS",
    "XH": "SS"
}

function ScoreDial(props) {
    const arc = d3.arc();
    const pie = d3.pie().sortValues(null);
    const [displayedRank, setDisplayedRank] = useState("D");
    const _rankCutoffs = rankCutoffs(Mods.hasMod(props.score.mods, "CL"));
    const springData = useSpring({
        from: {
            pos: [0]
        },
        to: {
            //radians
            pos: [(props.accuracy * 360) * (Math.PI / 180)]
        },
        config: {
            duration: 1250,
            easing: d3.easeQuadInOut,
        },
        onChange: (result, spring, item) => {
            // setDisplayedRank(rankCutoffs(Mods.hasMod(props.mods, "CL")));
            const rad = result.value.pos[0];
            const progress = rad / (2 * Math.PI);
            const grade = getRankFromAccuracy(props.score, progress);
            setDisplayedRank(displayRank[grade]);
        }
    })

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
                            pie(_rankCutoffs).map((d) => (
                                <path
                                    key={d.index}
                                    className={`score_dial_inner score_dial_inner-${d.index}`}
                                    d={arc({ innerRadius: 68, outerRadius: 73, ...d }) ?? undefined}
                                />
                            ))
                        }
                        {
                            // pie(valueData).map((d, i) => (
                            <>
                                <path
                                    key={1}
                                    className={`score_dial_outer score_dial_outer-${1}`}
                                    d={arc({ innerRadius: 75, outerRadius: 100, startAngle: 0, endAngle: 2 * Math.PI }) ?? undefined}
                                />
                                <animated.path
                                    key={0}
                                    className={`score_dial_outer score_dial_outer-${0}`}
                                    // d={arc({ innerRadius: 75, outerRadius: 100, ...d }) ?? undefined}
                                    d={
                                        springData.pos.to((accuracy) => {
                                            return arc({ innerRadius: 75, outerRadius: 100, startAngle: 0, endAngle: accuracy })
                                        })
                                    }
                                />
                            </>
                            // ))
                        }
                    </g>
                </svg>
            </div>

            <div className='score_dial_layer score_dial_layer_grade'>
                <span>{displayedRank}</span>
            </div>
        </div>
    );
}

export default ScoreDial;